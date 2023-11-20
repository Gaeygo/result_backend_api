//TODO:
//Affect grades
//view peformance of its own students and subjects

import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AddGradeInput } from "./teacherSchema";

export const addGrade = async (request: FastifyRequest<{
    Body: AddGradeInput
}>, response: FastifyReply) => {
    const grade = await prisma.grade.create({
        data: { ...request.body, teacherId: +request.user.id }
    })
}


export const getSubjects = async (request: FastifyRequest, response: FastifyReply) => {
    const subjects = await prisma.subject.findMany({
        where: {
            teacherId: +request.user.id
        },
        select: {
            id: true,
            subjectName: true,
            
        }
    })
}

export const getGrades = async (request: FastifyRequest<{
    Body: { subjectId: string }
}>, reply: FastifyReply) => {
    const grades = await prisma.subject.findMany({
        where: {
            id: request.body.subjectId,
            teacherId: +request.user.id
        },
        select: {
            grades: true
        }
    })
}