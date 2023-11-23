import { FastifyReply, FastifyRequest } from "fastify"
import { verifyToken } from "./authjwt"
import HttpException from "../schema/error"
import { ADMINENUM, ROLEENUM } from "../modules/admin/adminSchema"

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



export const authMiddleware = <TRole extends ROLEENUM, T, K>(allowedRoles: TRole[]) => {
    return async (req: FastifyRequest<{
        Body: T,
        Querystring: K,
    }>, rep: FastifyReply) => {
        const userRole = req.user.role as TRole;

        if (!allowedRoles.includes(userRole)) {
            rep.status(403).send({ message: 'Unauthorized: You do not have permission to access this resource.' });
        }
    };
}