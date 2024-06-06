import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { StudentClassAssignmentInput } from "./adminSchema";


export const studentClassAssignment = (request: FastifyRequest<{
    Body: StudentClassAssignmentInput
}>, response: FastifyReply) => {

}

//TODO:
//promotion, demotion and rentention
const promotion = (request: FastifyRequest<{

}>, response: FastifyReply) => {

}