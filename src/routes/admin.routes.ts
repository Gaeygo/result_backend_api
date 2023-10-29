import { FastifyInstance } from "fastify"
import { createAdmin } from "../controller/admin.controller"
import { $ref } from "../schema/adminSchema"

export async function AdminRoutes(server: FastifyInstance) {
    server.post("/createAdmin", {
        schema: {
            body: $ref("adminCreateSchema")
        }
    }, createAdmin)
}