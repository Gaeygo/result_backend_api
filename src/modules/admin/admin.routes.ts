import { FastifyInstance } from "fastify"
import { createAdmin, suspendAdmin } from "./admin.controller"
import { $ref } from "./adminSchema"

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
    }, suspendAdmin)
}