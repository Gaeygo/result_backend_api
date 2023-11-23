import { FastifyInstance } from "fastify"
import { $ref, AddGradeInput } from "./teacherSchema"
import { addGrade, getGrades } from "./teacher.controller"
import { authMiddleware, authVerify } from "../../auth/authMiddleware"
import { ROLEENUM } from "../admin/adminSchema"


export async function TeacherRoutes(server: FastifyInstance) {
    server.post("/add-grades", {
        schema: {
            body: $ref("addGrade")
        },
        preValidation: [authVerify<AddGradeInput, {}>, authMiddleware<ROLEENUM, AddGradeInput, {}>(["TEACHER"])]

    }, addGrade)

    server.post("/view-grades", {
        preValidation: [authVerify<{ subjectId: string }, {}>, authMiddleware<ROLEENUM, { subjectId: string }, {}>(["TEACHER"])]
    }, getGrades)

}