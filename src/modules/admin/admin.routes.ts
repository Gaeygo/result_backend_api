import { FastifyInstance } from "fastify"
import { createAdmin, registerClass, registerStudent, registerAndAssignSubject, registerTeacher, suspendAdmin, addNewSubject, createAndInitialiseSession } from "./admin.controller"
import { $ref, AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, ROLEENUM, CreateSubjectInput } from "./adminSchema"
import { authVerify, authMiddleware } from "../../auth/authMiddleware"
import { CreateSessionSchema } from "../../schema/schema"

export async function AdminRoutes(server: FastifyInstance) {
    server.post("/createAdmin", {
        schema: {
            body: $ref("adminCreateSchema")
        },
        preHandler: [authVerify<AdminCreateInput, {}>, authMiddleware<AdminCreateInput, {}>([ROLEENUM.SUPERADMIN])],

    }, createAdmin)

    server.post("/suspendAdmin", {
        schema: {
            body: $ref("adminSuspendSchema")
        },
        preHandler: [authVerify<AdminSuspendBody, {}>, authMiddleware<AdminSuspendBody, {}>([ROLEENUM.SUPERADMIN])],
    }, suspendAdmin)

    server.post("/initialiseSession", {
        schema: {
            body: CreateSessionSchema
        },

        preHandler: [authVerify<{ academicYear: string }, {}>, authMiddleware<{ academicYear: string }, {}>([ROLEENUM.SUPERADMIN])],

    }, createAndInitialiseSession)

    server.post("registerStudent", {
        schema: {
            body: $ref("studentCreateSchema")
        },
        preHandler: [authVerify<CreateStudentInput, {}>, authMiddleware<CreateStudentInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]
    }, registerStudent)

    server.post("registerTeacher", {
        schema: {
            body: $ref("teacherCreateSchema")
        },
        preHandler: [authVerify<CreateTeacherInput, {}>, authMiddleware<CreateTeacherInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]


    }, registerTeacher)

    server.post("registerClass", {
        schema: {
            body: $ref("createClassInput")
        },
        preHandler: [authVerify<CreateClassInput, {}>, authMiddleware<CreateClassInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]


    }, registerClass)

    server.post("assignSubject", {
        schema: {
            body: $ref("assignSubjectInputSchema")
        },
        preHandler: [authVerify<AssignSubjectInput, {}>, authMiddleware<AssignSubjectInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]


    }, registerAndAssignSubject)

    server.post("createSubject", {
        schema: {
            body: $ref("createSubjectInputSchema")
        },
        preHandler: [authVerify<CreateSubjectInput, {}>, authMiddleware<CreateSubjectInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]
    },
        addNewSubject)
}