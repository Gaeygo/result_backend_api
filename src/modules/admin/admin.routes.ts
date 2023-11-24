import { FastifyInstance } from "fastify"
import { createAdmin, registerClass, registerStudent, registerSubject, registerTeacher, suspendAdmin } from "./admin.controller"
import { $ref, AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, CreateSubjectInput, CreateTeacherInput, ROLEENUM } from "./adminSchema"
import { authVerify, authMiddleware } from "../../auth/authMiddleware"

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

    server.post("registerSubject", {
        schema: {
            body: $ref("subjectInputSchema")
        },
        preHandler: [authVerify<CreateSubjectInput, {}>, authMiddleware<CreateSubjectInput, {}>([ROLEENUM.SUPERADMIN, ROLEENUM.ADMIN])]


    }, registerSubject)
}