import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../lib/prisma";
import { createAdminDetails } from "../model/schema";


const createAdmin = async (request: FastifyRequest<{
    Body: createAdminDetails
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