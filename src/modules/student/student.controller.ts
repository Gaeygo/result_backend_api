//TODO:
//ISSUE COMPLAINTS CONCERNING GRADES
import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { getCurrentSessionFromConstant } from "../admin/admin.service";


//add schema support for id
export const viewHistoricGrades = async (request: FastifyRequest, response: FastifyReply) => {
    const result = await prisma.student.findUnique({
        where: {
            id: +request.user.id
        },
        select: {
            courseEnrollments: {
                select: {
                    termResults: true
                },
                orderBy: {
                    sessionId: "asc"
                }
            }
        }
    })

    if (result && result.courseEnrollments.length > 0) {
        response.code(200).send({ results: result, message: "success" })

    }
    ///complete
}


//add schema support for id
//get current session and show grades
export const viewCurrentGrades = async (request: FastifyRequest, response: FastifyReply) => {
    const result = await prisma.student.findUnique({
        where: {
            id: +request.user.id
        },
        select: {
            courseEnrollments: {
                select: {
                    termResults: true
                },
            }
        }
    })

    if (result && result.courseEnrollments.length > 0) {
        response.code(200).send({ results: result, message: "success" })
    }
    ///complete
}