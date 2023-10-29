import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../lib/prisma";
import { AdminCreateInput } from "../schema/adminSchema";


export const createAdmin = async (request: FastifyRequest<{
    Body: AdminCreateInput
}>, response: FastifyReply) => {
    const adminDetails = await prisma.admin.create({
        data: {
            name: request.body.name,
            password: request.body.password,
            role: "ADMIN"
        }
    })

    response.send(adminDetails)

}


const suspendAdmin = async (request: FastifyRequest, response: FastifyReply) => {

}

//Send amil for approval of creation