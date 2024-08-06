import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const addGrade = z.object({
    value: z.number(),
    tutorNote: z.string().optional(),
    subjectAssignedId: z.string(),
    // teacherId: z.number(),
    courseEnrollmentId: z.string(),
})


export type AddGradeInput = z.infer<typeof addGrade>



export const { schemas: teacherSchema, $ref } = buildJsonSchemas({
    addGrade
}, { $id: "Teacher" })