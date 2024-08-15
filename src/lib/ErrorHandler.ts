import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import HttpException, { HttpStatus } from "../schema/error";
import logger from './logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApiResponse } from '../schema/schema';




// checking if an object is of a certain type
function isCustomInterface<T>(obj: unknown, typeCheck: (arg: unknown) => arg is T): obj is T {
    return typeCheck(obj);
}


function isMyInterfaceObject(arg: unknown): arg is FastifyError {
    // Perform the actual type check here
    // Return true if the object satisfies MyInterface, otherwise return false
    return typeof (arg as FastifyError)?.code === "string"
}

export const errorHandler = (error: Error | HttpException | PrismaClientKnownRequestError | FastifyError | unknown, request: FastifyRequest, reply: FastifyReply) => {
    const statusCode = (error as FastifyError).statusCode || 500;




    // return reply.status(statusCode).send(response);
    if (error instanceof HttpException) {
        const { statusCode, message, status } = error

        const response: ApiResponse<null> = {
            success: false,
            error: {
                message: error.message,
                statusCode: error.statusCode,
                errorType: error.name,
                errorCode: error.status
            }
        };

        reply.status(statusCode).send(response);

        logger.error(error, message)
    } else if (error instanceof PrismaClientKnownRequestError) {
        const newError = handlePrismaError(error)
        const response: ApiResponse<null> = {
            success: false,
            error: {
                message: newError.message,
                statusCode: newError.statusCode,
                errorType: newError.name,
                errorCode: newError.status
            }
        };
        reply.status(400).send(response);

    }

    else if (isCustomInterface<FastifyError>(error, isMyInterfaceObject)) {
        if (error.validation) {
            logger.error(error, error.message)
            const response: ApiResponse<null> = {
                success: false,
                error: {
                    message: error.message,
                    statusCode: error.statusCode || 300,
                    errorType: error.name,
                    errorCode: error.code
                }
            };
            console.log(error)
            return reply.status(error.statusCode || 300).send(response)
        }
        logger.error(error, error.message)

        const response: ApiResponse<null> = {
            success: false,
            error: {
                message: error.message,
                statusCode: error.statusCode || 300,
                errorType: error.name,
                errorCode: error.code
            }
        };

        reply.status(error.statusCode || 300).send(response);

    }
    const unknownError = new HttpException()
    logger.error(error, unknownError.message)
    const response: ApiResponse<null> = {
        success: false,
        error: {
            message: unknownError.message,
            statusCode: unknownError.statusCode,
            errorType: unknownError.name,
            errorCode: unknownError.status
        }
    };

    reply.status(unknownError.statusCode).send(response);



    // logger.error(error)
}






function handlePrismaError(error: PrismaClientKnownRequestError) {

    return new HttpException(400, error.message, error.code);

    // logger.error(error)
}



//FIXME: unique constraint handling





// errorHandler.ts