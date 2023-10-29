import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"


const adminCreateSchema = z.object({
    name: z.string(),
    password: z.string()
})


export type AdminCreateInput = z.infer<typeof adminCreateSchema>

export const { schemas: adminSchema, $ref } = buildJsonSchemas({
    adminCreateSchema
}, { $id: 'Admin' })