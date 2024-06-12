import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, courseEnrollmentInput, CreateSubjectInput } from "./adminSchema";
import { createClass, createStudent, AssignSubject, createTeacher, createSubject, studentClassAssignment, studentCourseEnrollment, getCurrentSession, getCurrentSessionFromConstant } from "./admin.service";
import { hashPassword } from "../../auth/password";
import { generateDatePairs } from "../../utils/GenerateObjects";
import HttpException from "../../schema/error";


export const createAdmin = async (request: FastifyRequest<{
    Body: AdminCreateInput
}>, response: FastifyReply) => {
    try {
        console.log(request.body)
        const password = await hashPassword(request.body.password)
        const adminDetails = await prisma.admin.create({
            data: {
                name: request.body.name,
                password: password,
                role: request.body.role,

            },
            select: {
                name: true,
                role: true,
                password: true
            }
        })

        response.send(adminDetails)
    } catch (error) {
        throw error
    }


}

//suspend an admin and can be done by superAdmin
export const suspendAdmin = async (request: FastifyRequest<{ Body: AdminSuspendBody }>, response: FastifyReply) => {
    try {
        const adminDetails = await prisma.admin.update({
            where: {
                id: request.body.adminSuspendId
            },
            data: {
                disabled: true
            },
            select: {
                name: true,
                role: true,
                disabled: true
            }
        })

        response.send({ message: `Admin ${adminDetails.name} has been disabled`, status: 204 },)
    } catch (error) {
        throw error
    }
}

//when a session is created 3 terms should automatically created
export const createAndInitialiseSession = async (request: FastifyRequest<{
    Body: {
        academicYear: string,
        startDate: Date,
        closeDate: Date
    }
}>, response: FastifyReply) => {
    try {
        const session = await prisma.session.create({
            data: {
                academicYear: request.body.academicYear,
                adminId: +request.user.id,
                startDate: request.body.startDate,
                closeDate: request.body.closeDate

            }
        })
        if (session) {
            //TODO:
            //just for dev needs to be changed later
            //
            const startingDate = new Date('2024-09-09');


            const dates = generateDatePairs(startingDate, 3, 3, 3)
            const terms = await prisma.term.createMany({
                data: [{
                    sessionId: session.id,
                    termName: "1st Term",
                    inTerm: true,
                    openDate: dates[0][0],
                    closedDate: dates[0][1]
                }, {
                    sessionId: session.id,
                    termName: "2nd Term",
                    openDate: dates[1][0],
                    closedDate: dates[1][1]
                }, {
                    sessionId: session.id,
                    termName: "3rd Term",
                    openDate: dates[2][0],
                    closedDate: dates[2][1]
                },
                ]
            })

            response.code(200).send({ message: ` ${session.academicYear} Session created` })

        }

    } catch (error) {
        throw error
    }

}

//set current session
export const addFirstSession = async (request: FastifyRequest<{
    Body: {
        currentSession: string
    }
}>, response: FastifyReply) => {
    //TODO:
    //check if session exists and if date has elapsed
    try {
        const session = await getCurrentSessionFromConstant(process.env.CURRENT_SESSION)


        if (!session) throw new HttpException(400, "Session does not exist")

        if (Date.now() > session.closeDate.getMilliseconds()) throw new HttpException(400, "Session time has elapsed can't be assigned")

        if (!request.body.currentSession || !process.env.CURRENT_SESSION) throw new HttpException(400, "details for session initialisation not provided")

        const sessionCheck = await getCurrentSession(request.body.currentSession)

        if (!sessionCheck) throw new HttpException(400, "Session does not exist")

        const currentSessionInit = await prisma.constant.create({
            data: {
                key: process.env.CURRENT_SESSION,
                value: request.body.currentSession,
                adminId: +request.user.id
            }
        })
        if (currentSessionInit) {
            response.status(200).send({ message: "Current session initialised", status: 200 })
        }
    } catch (error) {
        throw error
    }
}

export const changeSession = async (request: FastifyRequest<{
    Body: {
        newSession: string
    }
}>, response: FastifyReply) => {
    try {
        const currentSession = await getCurrentSessionFromConstant(process.env.CURRENT_SESSION)

        if (!currentSession) throw new HttpException(400, "session does not exist")

        if (currentSession.closeDate.getMilliseconds() < Date.now()) throw new HttpException(400, "Session can't be altered due to current session closed date to elasped")

        const sessionCheck = await getCurrentSession(request.body.newSession)

        if (!sessionCheck) throw new HttpException(400, "Session does not exist")


        const assignSession = await prisma.constant.update({
            where: {
                key: process.env.CURRENT_SESSION
            },
            data: {
                value: request.body.newSession
            }
        })

        response.status(200).send({message: "Current Session value has been Updated", status: 200})

    } catch (error) {
        throw error
    }



    //first get session
    //then confirm date hasn't yet elapsed
    //check if active, then add
    //to disable or remove make initial session inactive and then remove
}

//Send email for approval of creation || send details to phone number

//creation of Teachers
export const registerTeacher = async (request: FastifyRequest<{
    Body: CreateTeacherInput
}>, response: FastifyReply) => {
    try {
        const teacher = await createTeacher({ ...request.body, adminId: +request.user.id })
        response.send({ message: "Teacher registered", status: 201 })
    } catch (error) {
        throw error
    }
}

//create class
export const registerClass = async (request: FastifyRequest<{
    Body: CreateClassInput
}>, response: FastifyReply) => {
    try {
        const createdClass = await createClass({ ...request.body, adminId: +request.user.id })
        response.send({ message: "Class registered", status: 201 })

    } catch (error) {
        throw error
    }
}

//create subject
export const addNewSubject = async (request: FastifyRequest<{
    Body: CreateSubjectInput
}>, response: FastifyReply) => {
    try {
        const subject = await createSubject({ ...request.body, adminId: +request.user.id })
        response.send({ message: "Subject created", status: 201 })

    } catch (error) {
        throw error
    }
}

//register subject
export const registerAndAssignSubject = async (request: FastifyRequest<{
    Body: AssignSubjectInput
}>, response: FastifyReply) => {
    try {
        const subjectCreated = await AssignSubject({ ...request.body, adminId: +request.user.id })
        response.send({ message: "Subject registered", status: 200 })

    } catch (error) {
        throw error
    }
}


export const registerStudent = async (request: FastifyRequest<{
    Body: CreateStudentInput
}>, response: FastifyReply) => {
    try {
        const student = await createStudent({ ...request.body, adminId: +request.user.id })
        if (student) {
            const studentAssignment = await studentClassAssignment({ studentId: student.id, classId: request.body.classId, sessionId: request.body.sessionId, adminId: +request.user.id })

            response.send({ message: "Student registered", status: 201 })
        }
        throw new HttpException(400, "student not created")

    } catch (error) {
        throw error
    }
}



//TODO: STUDENT CLASS REGISTRATION