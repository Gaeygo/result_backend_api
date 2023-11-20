//TODO:
//ISSUE COMPLAINTS CONCERNING GRADES
import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";

const viewGrades = async (request: FastifyRequest, response: FastifyReply) => {
    const result = await prisma.student.findUnique({
        where: {
            id: +request.user.id
        },
        select: {
            grades: true
        }
    })
}
