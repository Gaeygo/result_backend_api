import { FastifyInstance } from "fastify";
import { $ref } from "../modules/admin/adminSchema";
import { login } from "./authMiddleware";


export async function AuthRoute(server: FastifyInstance) {
    server.post("/login", {
        schema: {
            body: $ref("loginSchema")
        }
    }, login)
}

