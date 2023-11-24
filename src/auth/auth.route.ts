import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ROLEENUM } from "../modules/admin/adminSchema";
import prisma from "../lib/prisma";
import { verifyPassword } from "./password";
import { createToken } from "./authjwt";
import { AdminRole } from "@prisma/client";

export function AuthRoute(server: FastifyInstance) {

}

enum ADMINENUM {
    SUPERADMIN,
    ADMIN
}

//due to the separation of users on various tables, i.e ADMIN, STUDENT AND TEACHER, the role is used as an identifier and authentication is carried out
const login = async (request: FastifyRequest<{
    Body: { userName: string, password: string, userRole: ROLEENUM }
}>, response: FastifyReply) => {
    try {
        const role = request.body.userRole

        if (role === ROLEENUM.ADMIN || role === ROLEENUM.SUPERADMIN) {
            const user = await prisma.admin.findUnique({
                where: {
                    name: request.body.userName,
                    role: matchEnums(role)
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.name, role: role })
            request.headers["x-access-key"] = token

        } else if (role === ROLEENUM.STUDENT) {
            const user = await prisma.student.findUnique({
                where: {
                    phonenumber: +request.body.userName
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.firstName, role: role })
            request.headers["x-access-key"] = token
        } else if (role === ROLEENUM.TEACHER) {
            const user = await prisma.teacher.findUnique({
                where: {
                    phonenumber: +request.body.userName
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.firstName, role: role })
            request.headers["x-access-key"] = token
        }
    } catch (error) {

    }


}


//match up AdminROle from schema declaration to the ROLEENUM DECLARATION
const matchEnums = (option: ROLEENUM) => {
    if (option === ROLEENUM.ADMIN) return AdminRole.ADMIN
    else if (option === ROLEENUM.SUPERADMIN) return AdminRole.SUPERADMIN


}