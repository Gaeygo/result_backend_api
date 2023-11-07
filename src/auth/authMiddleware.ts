import { FastifyReply, FastifyRequest } from "fastify"
import { verifyToken } from "./authjwt"
import HttpException from "../schema/error"
import { JwtPayload } from "jsonwebtoken"

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

