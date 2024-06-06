import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"
import { type } from "os"
import { ClassLevel } from "@prisma/client"




const adminEnum = z.enum(["ADMIN", "SUPERADMIN"])
export enum ROLEENUM {
    SUPERADMIN, ADMIN, TEACHER, STUDENT
}
const roleZodEnum = z.enum(["SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"])

const gradeLevelEnum = z.enum(["GRADE7", "GRADE8", "GRADE9", "GRADE10", "GRADE11", "GRADE12"])
const NGgradeEnum = z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"])

export type ZODROLEENUM = z.infer<typeof roleZodEnum>

export type ADMINENUM = z.infer<typeof adminEnum>

export type ROLESENUM = {
    SUPERADMIN: "SUPERADMIN",
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT"
}



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
    phonenumber: z.string(),
    password: z.string()


})

const studentCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    password: z.string(),
    active: z.boolean(),
    classId: z.number(),
    phonenumber: z.string(),
    sessionId: z.number(),
    motherMaidenName: z.string(),
    classToBeAdmittedTo: z.union([gradeLevelEnum, NGgradeEnum])

})

const createClassInput = z.object({
    name: z.string(),
    // teacherId: z.number().optional(),
    active: z.boolean(),
    classLevel: z.union([gradeLevelEnum, NGgradeEnum])

})

const createSubjectInputSchema = z.object({
    name: z.string(),
    allowedClassLevels: z.array(z.nativeEnum(ClassLevel))
    // z.union([gradeLevelEnum, NGgradeEnum]),

})

const assignSubjectInputSchema = z.object({
    subjectName: z.string(),
    classId: z.number(),
    active: z.boolean(),
    subjectId: z.number(),
    sessionId: z.number()


})

const courseEnrollmentSchema = z.object({
    studentId: z.number(),
    sessionId: z.number(),
    subjectId: z.string(),
    termId: z.number(),
    classAssignmentId: z.number()
})

const studentClassAssignmentSchema = z.object({
    studentId: z.number(),
    classId: z.number(),
    sessionId: z.number()
})


//LOGIN//
const loginSchema = z.object({
    userName: z.string(),
    password: z.string(),
    userRole: roleZodEnum
})

export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type AdminSuspendBody = z.infer<typeof adminSuspendSchema>
export type CreateTeacherInput = z.infer<typeof teacherCreateSchema>
export type AssignSubjectInput = z.infer<typeof assignSubjectInputSchema>
export type CreateSubjectInput = z.infer<typeof createSubjectInputSchema>
export type CreateStudentInput = z.infer<typeof studentCreateSchema>
export type CreateClassInput = z.infer<typeof createClassInput>
export type courseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>
export type LoginBodyInput = z.infer<typeof loginSchema>
export type StudentClassAssignmentInput = z.infer<typeof studentClassAssignmentSchema>

export const { schemas: adminSchema, $ref } = buildJsonSchemas({
    adminCreateSchema, adminSuspendSchema, teacherCreateSchema, studentClassAssignmentSchema, assignSubjectInputSchema, studentCreateSchema, createClassInput, loginSchema, createSubjectInputSchema
}, { $id: 'Admin' })