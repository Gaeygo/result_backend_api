import { FastifyInstance } from "fastify";
import { $ref } from "../modules/admin/adminSchema";
import { login } from "./authMiddleware";


export async function AuthRoute(server: FastifyInstance) {
    server.post("/login", {
        schema: {
            body: $ref("loginSchema")
            // body: {
            //     required: ["userName", "password", "userRole"],
            //     type: "object",
            //     properties: {
            //         userName: { type: "string" },
            //         password: { type: "string" },
            //         userRole: {
            //             type: "string",
            //             enum: ["SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"]
            //         }
            //     }
            // }

        },

    }, login)
}

