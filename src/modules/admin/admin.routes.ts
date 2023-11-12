import { FastifyInstance } from "fastify"
import { createAdmin, suspendAdmin } from "./admin.controller"
import { $ref, AdminSuspendBody } from "./adminSchema"
import { authVerify, checkRole } from "../../auth/authMiddleware"

export async function AdminRoutes(server: FastifyInstance) {
    server.post("/createAdmin", {
        schema: {
            body: $ref("adminCreateSchema")
        }
    }, createAdmin)

    server.post("/suspendAdmin", {
        schema: {
            body: $ref("adminSuspendSchema")
        },
        preValidation: [authVerify<AdminSuspendBody, {}>, checkRole<AdminSuspendBody, {}>],
    }, suspendAdmin)
}