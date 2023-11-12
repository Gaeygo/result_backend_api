import { FastifyReply, FastifyRequest } from "fastify"
import { verifyToken } from "./authjwt"
import HttpException from "../schema/error"
import { JwtPayload } from "jsonwebtoken"
import { ROLEENUM } from "../modules/admin/adminSchema"

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

export const checkRole = async<T, K>(request: FastifyRequest<{
    Body: T,
    Querystring: K,


}>, response: FastifyReply) => {
    const role = request.user.role as ROLEENUM
    if (role === "ADMIN") throw new HttpException(403, "Admin is authorised to perform such action")

}