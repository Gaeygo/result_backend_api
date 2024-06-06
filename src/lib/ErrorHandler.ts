import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import HttpException, { HttpStatus } from "../schema/error";
import logger from './logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// checking if an object is of a certain type
function isCustomInterface<T>(obj: unknown, typeCheck: (arg: unknown) => arg is T): obj is T {
    return typeCheck(obj);
}


function isMyInterfaceObject(arg: unknown): arg is FastifyError {
    // Perform the actual type check here
    // Return true if the object satisfies MyInterface, otherwise return false
    return typeof (arg as FastifyError)?.code === "string"
}

export const errorHandler = (error: HttpException | PrismaClientKnownRequestError | FastifyError | unknown, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof HttpException) {
        const { statusCode, message, status } = error

        reply.status(statusCode).send({
            status,
            statusCode: statusCode,
            message: message,
        });

        logger.error(error, message)
    } else if (error instanceof PrismaClientKnownRequestError) {
        handlePrismaError(error)
        reply.status(400).send({
            status: error.code,
            statusCode: 400,
            message: error.message,
        });

    }

    else if (isCustomInterface<FastifyError>(error, isMyInterfaceObject)) {
        logger.error(error, error.message)
        reply.status(error.statusCode || 300).send({
            status: error.code,
            statusCode: error.statusCode,
            message: error.message,
        });

    }
    const unknownError = new HttpException()
    logger.error(error, unknownError.message)

    reply.status(unknownError.statusCode).send({
        statusCode: unknownError.statusCode,
        message: unknownError.message,
        error
    });



    // logger.error(error)
}






function handlePrismaError(error: PrismaClientKnownRequestError) {

    return new HttpException(400, error.message, error.code);

    // logger.error(error)
}



//FIXME: unique constraint handling