import { FastifyInstance } from "fastify"
import { createAdmin, registerClass, registerStudent, registerSubject, registerTeacher, suspendAdmin } from "./admin.controller"
import { $ref, AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, CreateSubjectInput, CreateTeacherInput, ROLEENUM } from "./adminSchema"
import { authVerify, authMiddleware } from "../../auth/authMiddleware"

export async function AdminRoutes(server: FastifyInstance) {
    server.post("/createAdmin", {
        schema: {
            body: $ref("adminCreateSchema")
        },
        preHandler: [authVerify<AdminCreateInput, {}>, authMiddleware<ROLEENUM, AdminCreateInput, {}>(["SUPERADMIN"])],

    }, createAdmin)

    server.post("/suspendAdmin", {
        schema: {
            body: $ref("adminSuspendSchema")
        },
        preHandler: [authVerify<AdminSuspendBody, {}>, authMiddleware<ROLEENUM, AdminSuspendBody, {}>(["SUPERADMIN"])],
    }, suspendAdmin)

    server.post("registerStudent", {
        schema: {
            body: $ref("studentCreateSchema")
        },
        preHandler: [authVerify<CreateStudentInput, {}>, authMiddleware<ROLEENUM, CreateStudentInput, {}>(["SUPERADMIN", "ADMIN"])]
    }, registerStudent)

    server.post("registerTeacher", {
        schema: {
            body: $ref("teacherCreateSchema")
        },
        preHandler: [authVerify<CreateTeacherInput, {}>, authMiddleware<ROLEENUM, CreateTeacherInput, {}>(["SUPERADMIN", "ADMIN"])]


    }, registerTeacher)

    server.post("registerClass", {
        schema: {
            body: $ref("createClassInput")
        },
        preHandler: [authVerify<CreateClassInput, {}>, authMiddleware<ROLEENUM, CreateClassInput, {}>(["SUPERADMIN", "ADMIN"])]


    }, registerClass)

    server.post("registerSubject", {
        schema: {
            body: $ref("subjectInputSchema")
        },
        preHandler: [authVerify<CreateSubjectInput, {}>, authMiddleware<ROLEENUM, CreateSubjectInput, {}>(["SUPERADMIN", "ADMIN"])]


    }, registerSubject)
}