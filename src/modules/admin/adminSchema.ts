import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"


const adminCreateSchema = z.object({
    name: z.string(),
    password: z.string()
})

const adminSuspendSchema = z.object({
    adminSuspendId: z.number()
})

const teacherCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),

})

const studentCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    password: z.string(),
    class: z.string(),

})

const createClassInput = z.object({
    name: z.string(),
    adminId: z.number(),
    teacherId: z.number()

})

const subjectInputSchema = z.object({
    subjectName: z.string(),
    
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type AdminSuspendBody = z.infer<typeof adminSuspendSchema>
export type CreateTeacherInput = z.infer<typeof teacherCreateSchema>
export type CreateSubjectInput = z.infer<typeof subjectInputSchema>
export type CreateStudentInput = z.infer<typeof studentCreateSchema>
export type CreateClassInput = z.infer<typeof createClassInput>

export const { schemas: adminSchema, $ref } = buildJsonSchemas({
    adminCreateSchema, adminSuspendSchema, teacherCreateSchema, subjectInputSchema, studentCreateSchema, createClassInput
}, { $id: 'Admin' })