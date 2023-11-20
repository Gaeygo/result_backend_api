import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const addGrade = z.object({
    value: z.number(),
    tutorNote: z.string().optional(),
    subjectId: z.string(),
    // teacherId: z.number(),
    courseEnrollmentId: z.string(),
})


export type AddGradeInput = z.infer<typeof addGrade>



export const { schemas: teacherSchema, $ref } = buildJsonSchemas({}, { $id: "Teacher" })