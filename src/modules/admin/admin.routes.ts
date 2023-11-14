import { FastifyInstance } from "fastify"
import { createAdmin, registerClass, registerStudent, registerSubject, registerTeacher, suspendAdmin } from "./admin.controller"
import { $ref, AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, CreateSubjectInput, CreateTeacherInput } from "./adminSchema"
import { authVerify, checkRole } from "../../auth/authMiddleware"

export async function AdminRoutes(server: FastifyInstance) {
    server.post("/createAdmin", {
        schema: {
            body: $ref("adminCreateSchema")
        },
        preValidation: [authVerify<AdminCreateInput, {}>, checkRole<AdminCreateInput, {}>],

    }, createAdmin)

    server.post("/suspendAdmin", {
        schema: {
            body: $ref("adminSuspendSchema")
        },
        preValidation: [authVerify<AdminSuspendBody, {}>, checkRole<AdminSuspendBody, {}>],
    }, suspendAdmin)

    server.post("registerStudent", {
        schema: {
            body: $ref("studentCreateSchema")
        },
        preValidation: [authVerify<CreateStudentInput, {}>, checkRole<CreateStudentInput, {}>]
    }, registerStudent)

    server.post("registerTeacher", {
        schema: {
            body: $ref("teacherCreateSchema")
        },
        preValidation: [authVerify<CreateTeacherInput, {}>, checkRole<CreateTeacherInput, {}>]


    }, registerTeacher)

    server.post("registerClass", {
        schema: {
            body: $ref("createClassInput")
        },
        preValidation: [authVerify<CreateClassInput, {}>, checkRole<CreateClassInput, {}>]


    }, registerClass)

    server.post("registerSubject", {
        schema: {
            body: $ref("subjectInputSchema")
        },
        preValidation: [authVerify<CreateSubjectInput, {}>, checkRole<CreateSubjectInput, {}>]


    }, registerSubject)
}