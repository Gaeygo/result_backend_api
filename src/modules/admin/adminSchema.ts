import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"


const adminCreateSchema = z.object({
    name: z.string(),
    password: z.string()
})

const adminSuspendSchema = z.object({
    adminSuspendId: z.number()
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type AdminSuspendBody = z.infer<typeof adminSuspendSchema>

export const { schemas: adminSchema, $ref } = buildJsonSchemas({
    adminCreateSchema, adminSuspendSchema
}, { $id: 'Admin' })