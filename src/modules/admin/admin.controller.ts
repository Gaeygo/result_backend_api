import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, courseEnrollmentInput, CreateSubjectInput } from "./adminSchema";
import { createClass, createStudent, AssignSubject, createTeacher, createSubject } from "./admin.service";
import { hashPassword } from "../../auth/password";
import { generateDatePairs } from "../../utils/GenerateObjects";


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
        academicYear: string
    }
}>, response: FastifyReply) => {
    try {
        const session = await prisma.session.create({
            data: {
                academicYear: request.body.academicYear,
                adminId: +request.user.id
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
        response.send({ message: "Student registered", status: 201 })

    } catch (error) {
        throw error
    }
}

// first enroll in a class, then run course enrollement
export const studentCourseEnrollment = async (request: FastifyRequest<{
    Body: courseEnrollmentInput
}>, response: FastifyReply) => {
    const courseEnrolled = await prisma.courseEnrollment.create({
        data: request.body
    })

}


//TODO: