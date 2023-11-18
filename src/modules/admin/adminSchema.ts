import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"


const roleEnum = z.enum(["ADMIN", "SUPERADMIN"])

export type ROLEENUM = z.infer<typeof roleEnum>

const adminCreateSchema = z.object({
    name: z.string(),
    password: z.string(),
    role: roleEnum.optional()
})

const adminSuspendSchema = z.object({
    adminSuspendId: z.number()
})

const teacherCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    active: z.boolean()

})

const studentCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    password: z.string(),
    class: z.string(),
    active: z.boolean(),
    classId: z.number()

})

const createClassInput = z.object({
    name: z.string(),
    teacherId: z.number(),
    active: z.boolean()

})

const subjectInputSchema = z.object({
    subjectName: z.string(),
    classId: z.number(),
    active: z.boolean()


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