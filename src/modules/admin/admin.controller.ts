import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { AdminCreateInput, AdminSuspendBody, CreateClassInput, CreateStudentInput, CreateSubjectInput, CreateTeacherInput } from "./adminSchema";
import { createClass, createStudent, createSubject, createTeacher } from "./admin.service";


export const createAdmin = async (request: FastifyRequest<{
    Body: AdminCreateInput
}>, response: FastifyReply) => {
    try {
        const adminDetails = await prisma.admin.create({
            data: {
                name: request.body.name,
                password: request.body.password,
                role: request.body.role
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

//Send email for approval of creation || send details to phone number

//creation of Teachers
export const registerTeacher = async (request: FastifyRequest<{
    Body: CreateTeacherInput
}>, response: FastifyReply) => {
    try {
        const teacher = await createTeacher({ ...request.body, adminId: +request.user.id })
        response.send({message: "Teacher registered", status: 201})
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
        response.send({message: "Class registered", status: 201})

    } catch (error) {
        throw error
    }
}

//register subject
export const registerSubject = async (request: FastifyRequest<{
    Body: CreateSubjectInput
}>, response: FastifyReply) => {
    try {
        const subject = await createSubject({ ...request.body, adminId: +request.user.id })
        response.send({message: "Subject registered", status: 201})

    } catch (error) {
        throw error
    }
}


export const registerStudent = async (request: FastifyRequest<{
    Body: CreateStudentInput
}>, response: FastifyReply) => {
    try {
        const student = await createStudent({ ...request.body, adminId: +request.user.id })
        response.send({message: "Student registered", status: 201})

    } catch (error) {
        throw error
    }
}
