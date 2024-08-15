//TODO:
//Affect grades
//view peformance of its own students and subjects

import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AddGradeInput } from "./teacherSchema";
import { getCurrentTerm } from "../admin/admin.service";

export const addGrade = async (request: FastifyRequest<{
    Body: AddGradeInput
}>, response: FastifyReply) => {

    const currentTerm = await getCurrentTerm()
    if (currentTerm.success === true && currentTerm.term) {
        ///1. look for student courseenrollment from subjectassigned to you
        ///2. check for current term 
        ///3. 
        // const grade = await prisma.grade.create({
        //     data: { ...request.body, teacherId: +request.user.id }
        // })
        const addGrade = await prisma.courseEnrollment.update({
            where: {
                id: request.body.courseEnrollmentId,
                subjectId: request.body.subjectAssignedId
            },
            data: {
                termResults: {
                    create: {
                        grade: request.body.value,
                        tutorNote: request.body.tutorNote,
                        //addreal term id    
                        termId: currentTerm.term.id

                    }

                }
            }
        })
    }


}

//create a mechanism to set current term 
//can easily update results via term result

export const getSubjectsAssignedto = async (request: FastifyRequest, response: FastifyReply) => {
    const subjects = await prisma.subjectAssigned.findMany({
        where: {
            teacherId: +request.user.id
        },
        select: {
            id: true,
            Subject: {
                select: {
                    name: true
                }
            },
            class: {
                select: {
                    classLevel: true
                }
            }

        }
    })
}

//getSubjectAssignedto to see courseenrollments and students
//when teacher clicks on a subject to add grades this details are given based on subjectAssigned id given
export const getSubjectAssignedtoDetails = async (request: FastifyRequest<{
    Body: {
        subjectAssignedId: string
    }
}>, response: FastifyReply) => {
    const subjectAssignedDetails = await prisma.subjectAssigned.findUnique({
        where: {
            id: request.body.subjectAssignedId,
            teacherId: +request.user.id
        }
    })

}



//
export const getGrades = async (request: FastifyRequest<{
    Body: { subjectId: string }
}>, reply: FastifyReply) => {
    const grades = await prisma.subjectAssigned.findMany({
        where: {
            id: request.body.subjectId,
            teacherId: +request.user.id
        },
        select: {
            courseEnrollments: {
                select: {
                    termResults: true
                }
            }
        }
    })
}