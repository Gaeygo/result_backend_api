import { FastifySchema } from "fastify";


export const CreateSessionSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            academicYear: { type: "string" }
        },
        required: ["academicYear"]
    }
}


// export type ErrorDetails = {
//     field?: string;
//     message: string;
//   };
  
  export type ErrorResponse = {
    message: string;
    statusCode: number;
    errorType: string;
    errorCode: string;
    // details?: ErrorDetails[];
  };

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
  };