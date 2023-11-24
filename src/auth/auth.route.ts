import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ROLEENUM } from "../modules/admin/adminSchema";
import prisma from "../lib/prisma";
import { verifyPassword } from "./password";
import { createToken } from "./authjwt";

export function AuthRoute(server: FastifyInstance) {

}


const login = async (request: FastifyRequest<{
    Body: { userName: string, password: string, userRole: ROLEENUM }
}>, response: FastifyReply) => {
    try {
        const role = request.body.userRole

        if (role === "ADMIN" || role === "SUPERADMIN") {
            const user = await prisma.admin.findUnique({
                where: {
                    name: request.body.userName
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.name, role: user.role })
            request.headers["x-access-key"] = token

        } else if (role === "STUDENT") {
            const user = await prisma.student.findUnique({
                where: {
                    phonenumber: +request.body.userName
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.firstName, role: "STUDENT" })
            request.headers["x-access-key"] = token
        } else if (role === "TEACHER") {
            const user = await prisma.teacher.findUnique({
                where: {
                    phonenumber: +request.body.userName
                }
            })
            if (!user) return //throw error
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) return //throw error
            const token = createToken({ id: user.id, name: user.firstName, role: "STUDENT" })
            request.headers["x-access-key"] = token
        }
    } catch (error) {

    }


}