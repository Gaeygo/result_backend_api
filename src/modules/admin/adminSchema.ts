import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"
import { type } from "os"


const roleEnum = z.enum(["ADMIN", "SUPERADMIN", "TEACHER", "STUDENT"])

const adminEnum = z.enum(["ADMIN", "SUPERADMIN"])
export type ROLEENUM = z.infer<typeof roleEnum>
export type ADMINENUM = z.infer<typeof adminEnum>


const adminCreateSchema = z.object({
    name: z.string(),
    password: z.string(),
    role: adminEnum.optional()
})

const adminSuspendSchema = z.object({
    adminSuspendId: z.number()
})

const teacherCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    active: z.boolean(),
    phonenumber: z.number(),
    password: z.string()


})

const studentCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    password: z.string(),
    class: z.string(),
    active: z.boolean(),
    classId: z.number(),
    phonenumber: z.number()

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

const courseEnrollmentSchema = z.object({
    studentId: z.number(),
    sessionId: z.number(),
    subjectId: z.string()
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type AdminSuspendBody = z.infer<typeof adminSuspendSchema>
export type CreateTeacherInput = z.infer<typeof teacherCreateSchema>
export type CreateSubjectInput = z.infer<typeof subjectInputSchema>
export type CreateStudentInput = z.infer<typeof studentCreateSchema>
export type CreateClassInput = z.infer<typeof createClassInput>
export type courseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>

export const { schemas: adminSchema, $ref } = buildJsonSchemas({
    adminCreateSchema, adminSuspendSchema, teacherCreateSchema, subjectInputSchema, studentCreateSchema, createClassInput
}, { $id: 'Admin' })