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