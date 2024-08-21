//TODO:
//Affect grades
//view peformance of its own students and subjects

import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AddGradeInput } from "./teacherSchema";
import { getCurrentSessionFromConstant, getCurrentTerm } from "../admin/admin.service";
import HttpException from "../../schema/error";
import { fetchSubjectAssignedDetails, SubjectAssignedDetailsOutput, submitGrade } from "./teacher.service";
import { ApiResponse } from "../../schema/schema";
import { CourseEnrollment, SubjectAssigned, TermResult } from "@prisma/client";

export const addGrade = async (request: FastifyRequest<{
    Body: AddGradeInput
}>, reply: FastifyReply) => {
    try {

        const currentTerm = await getCurrentTerm()
        const currentSession = await getCurrentSessionFromConstant()

        if (!currentSession) throw new HttpException(400, "Current Session not set refer to admin")


        if (!currentTerm.term) throw new HttpException(400, "Current term not set refer to admin")
        //find if grade has been add and deter
        const checkIfGradeExist = await prisma.termResult.findUnique({
            where: {
                termResultUniqueId: {
                    courseEnrollmentId: request.body.courseEnrollmentId,
                    termId: currentTerm.term.id
                }
            }
        })
        if (checkIfGradeExist && checkIfGradeExist.grade) {
            const error = new HttpException(400, "Grade already created")
            const response: ApiResponse<null> = {
                success: false,
                error: {
                    message: error.message,
                    statusCode: error.statusCode,
                    errorType: error.name,
                    errorCode: error.status
                }
            };
            return reply.status(error.statusCode).send(response)
        }
        const inputGrade = await submitGrade(request.body.courseEnrollmentId, request.body.subjectAssignedId, request.body.value, request.body.tutorNote, currentTerm.term)
        if (!inputGrade) throw new HttpException(400, "Grade can not be successfully added")
        //get all grades for subject being done
        // const subjectAssignedDetails = await prisma.subjectAssigned.findUnique({
        //     where: {
        //         id: request.body.subjectAssignedId,
        //         teacherId: +request.user.id
        //     },
        //     select: {

        //         courseEnrollments: {
        //             select: {
        //                 termResults: {
        //                     where: {
        //                         termId: currentTerm.term.id
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })
        // if (!subjectAssignedDetails?.courseEnrollments) return
        // // subjectAssignedDetails.courseEnrollments[0].termResults[0].grade
        // // type SubjectAssignedDetails = Omit<SubjectAssigned, "">
        // const results = subjectAssignedDetails.courseEnrollments
        // const response: ApiResponse<TermResult[]> = {
        //     success: true,
        //     data: results

        // }

        const subjectAssignedDetails = await
            fetchSubjectAssignedDetails({ termId: currentTerm.term.id, subjectAssignedId: request.body.subjectAssignedId, teacherId: +request.user.id, sessionId: currentSession.id })

        if (!subjectAssignedDetails) throw new HttpException(400, "Error while trying to fetch subject details")
        const response: ApiResponse<SubjectAssignedDetailsOutput> = {
            success: true,
            data: subjectAssignedDetails
        }
        reply.status(201).send(response)
    } catch (error) {
        throw error
    }



}

//create a mechanism to set current term 
//can easily update results via term result

export const getSubjectsAssignedto = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const subjects = await prisma.subjectAssigned.findMany({
            where: {
                teacherId: +request.user.id,
                // add sessionId: 

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
    } catch (error) {
        throw error

    }

}

//getSubjectAssignedto to see courseenrollments and students
//when teacher clicks on a subject to add grades this details are given based on subjectAssigned id given
export const getSubjectAssignedtoDetails = async (request: FastifyRequest<{
    Body: {
        subjectAssignedId: string
    }
}>, reply: FastifyReply) => {
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
                    //specify the term
                    termResults: true
                }
            }
        }
    })
}