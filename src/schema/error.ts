/// ERROR HANDLING CLASS THAT EXTENDS THE NATIVE ERROR CLASS

class HttpException extends Error {
    statusCode: number;
    status: string;
    message: string;

    constructor(
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        message: string = "Internal Server Error",
        status: string = "error"
    ) {
        super(message);
        this.status = "error";
        this.statusCode = statusCode;
        this.message = message;
    }
}





export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500
}



export default HttpException;


