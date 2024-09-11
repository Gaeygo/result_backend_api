import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";
import HttpException from "../schema/error";
import { IdGenerationStudentLog } from "@prisma/client";


interface IdGeneratorOptions {
    type: 'student' | 'teacher';
    userId: number;
    maxRetries?: number;
    statementTimeout?: number;
    transactionTimeout?: number;
    adminId: number

}

type IdGenerationResult = {
    newId: string;
    newIdDetails: IdGenerationStudentLog;
};

const generateNextId = async ({
    type,
    userId,
    maxRetries = 3,
    statementTimeout = 5000,
    transactionTimeout = 6000,
    adminId
}: IdGeneratorOptions): Promise<IdGenerationResult> => {
    const key = 'last_student_id'
    //////DONT CHANGE///////
    const initialId = 'GS001'

    let retries = 0

    while (retries < maxRetries) {
        try {
            // Start a transaction with a timeout
            const nextId = await prisma.$transaction(async (prisma) => {
                // Set a statement timeout
                await prisma.$executeRaw`SET LOCAL statement_timeout = ${statementTimeout}`

                // Attempt to lock the row with NOWAIT
                await prisma.$executeRaw`SELECT * FROM "Constant" WHERE "key" = ${key} FOR UPDATE NOWAIT`

                // Fetch the current ID
                const idTracker = await prisma.constant.findUnique({ where: { key } })

                if (!idTracker) {
                    // Initialize the ID tracker if it doesn't exist
                    await prisma.constant.create({ data: { key, value: initialId, adminId } })
                    const newIdDetails = await prisma.idGenerationStudentLog.create({
                        data: {
                            studentId: userId,
                            generatedId: initialId
                        }
                    })
                    //incrementId(initialId)
                    return { newId: initialId, newIdDetails };
                } else {
                    const newId = incrementId(idTracker.value)
                    // Update the last ID
                    await prisma.constant.update({
                        where: { key },
                        data: { value: newId },
                    })
                    const newIdDetails = await prisma.idGenerationStudentLog.create({
                        data: {
                            studentId: userId,
                            generatedId: newId
                        }
                    })
                    return { newId, newIdDetails };
                }
            }, {
                timeout: transactionTimeout
            })

            // If we get here, we've successfully generated an ID
            return nextId
            //update user to have the id added
        } catch (error) {
            console.error('Error generating ID:', error)
            if (!(error instanceof PrismaClientKnownRequestError)) throw error

            if (error.code === '55P03') { // Lock not available
                retries++
                await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, retries))) // Exponential backoff
            } else {
                throw new HttpException(500, 'An error occurred while generating the ID')
            }
        }
    }

    // If we've exhausted all retries
    throw new HttpException(500, 'Unable to generate ID after multiple attempts')
}

const incrementId = (currentId: string): string => {
    const prefix = currentId.slice(0, 2); // Either "GS" or "TS"

    // Extract the numeric part of the current ID
    const currentNumber = parseInt(currentId.slice(2), 10);

    if (isNaN(currentNumber) || currentNumber < 0) {
        throw new HttpException(500, "Invalid ID format");
    }

    // Increment the number
    const nextNumber = currentNumber + 1;

    // Convert to string and pad with zeros
    // The padStart length is dynamic, based on the current number's length
    // const paddedNumber = nextNumber.toString().padStart(Math.max(3, currentId.length - 2), '0');

    // If nextNumber is less than 100, pad to 3 digits. Otherwise, no padding.
    const paddedNumber = nextNumber < 100
        ? nextNumber.toString().padStart(3, '0')
        : nextNumber.toString();

    return `${prefix}${paddedNumber}`;
}

// incrementId("GS200")

export { generateNextId, incrementId };