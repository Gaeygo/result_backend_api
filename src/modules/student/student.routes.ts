import { FastifyInstance } from "fastify"
import { viewCurrentGrades } from "./student.controller"
import { authVerify } from "../../auth/authMiddleware"

export async function StudentRoutes(server: FastifyInstance) {
    server.get("/viewGrades", {
        preHandler: [authVerify<{}, {}>]
    }, viewCurrentGrades)
}