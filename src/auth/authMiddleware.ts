import { FastifyReply, FastifyRequest } from "fastify"
import { createToken, verifyToken } from "./authjwt"
import HttpException from "../schema/error"
import { ROLEENUM, ROLESENUM, ZODROLEENUM } from "../modules/admin/adminSchema"
import { AdminRole } from "@prisma/client"
import prisma from "../lib/prisma"
import { verifyPassword } from "./password"

export const authVerify = async<T, K>(request: FastifyRequest<{
    Body: T,
    Querystring: K,
    Headers: { "x-access-key": string }
}>, response: FastifyReply) => {
    try {
        if (!request.headers["x-access-key"]) throw new HttpException(403, "A token is required for access", "error")
        const details = verifyToken(request.headers["x-access-key"])
        request.user = details
    } catch (error) {
        throw error
    }

}


//Authorisation of users based on their assigned roles, so an array of users "roles" is presented and based on that access is determined

export const authMiddleware = <T, K>(allowedRoles: ROLEENUM[]) => {
    return async (req: FastifyRequest<{
        Body: T,
        Querystring: K,
    }>, rep: FastifyReply) => {
        for (const role of allowedRoles) {
            if (!Object.values(ROLEENUM).includes(role)) {
                return false;
            }
        }
        const userRole = req.user.role as ROLEENUM;

        if (!allowedRoles.includes(userRole)) {
            rep.status(403).send({ message: 'Unauthorized: You do not have permission to access this resource.' });
        }
    };
}



//due to the separation of users on various tables, i.e ADMIN, STUDENT AND TEACHER, the role is used as an identifier and authentication is carried out
export const login = async (request: FastifyRequest<{
    Body: { userName: string, password: string, userRole: ZODROLEENUM }
}>, response: FastifyReply) => {
    try {
        const role = getEnum(request.body.userRole)

        if (role === ROLEENUM.ADMIN || role === ROLEENUM.SUPERADMIN) {
            const user = await prisma.admin.findUnique({
                where: {
                    name: request.body.userName,
                    role: matchEnums(role)
                }
            })
            if (!user) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const token = createToken({ id: user.id, name: user.name, role: role })
            request.headers["x-access-key"] = token
        }
        else if (role === ROLEENUM.STUDENT) {
            const user = await prisma.student.findUnique({
                where: {
                    phonenumber: request.body.userName
                }
            })
            if (!user) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const token = createToken({ id: user.id, name: user.firstName, role: role })
            request.headers["x-access-key"] = token
        } else if (role === ROLEENUM.TEACHER) {
            const user = await prisma.teacher.findUnique({
                where: {
                    phonenumber: request.body.userName
                }
            })
            if (!user) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const passwordCorrect = await verifyPassword(request.body.password, user.password)
            if (!passwordCorrect) throw new HttpException(403, "User login details are incorrect", "AuthError")
            const token = createToken({ id: user.id, name: user.firstName, role: role })
            request.headers["x-access-key"] = token
        }
    } catch (error) {
        throw error
    }


}


//match up AdminROle from schema declaration to the ROLEENUM DECLARATION
const matchEnums = (option: ROLEENUM) => {
    if (option === ROLEENUM.ADMIN) return AdminRole.ADMIN
    else if (option === ROLEENUM.SUPERADMIN) return AdminRole.SUPERADMIN


}


const getEnum = (option: ZODROLEENUM) => {
    if (option === "ADMIN") return ROLEENUM.ADMIN
    else if (option === "SUPERADMIN") return ROLEENUM.SUPERADMIN
    else if (option === "TEACHER") return ROLEENUM.TEACHER
    else if (option === "STUDENT") return ROLEENUM.STUDENT
}


