import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { StudentClassAssignmentInput, courseEnrollmentInput } from "./adminSchema";
import { studentClassAssignment, studentCourseEnrollment } from "./admin.service";



// first enroll in a class, then run course enrollement
//FIXME: ADD STUDENT COURSE ENROLLEMENT TO SERVICES
export const studentCourseEnrollmentController = async (request: FastifyRequest<{
    Body: courseEnrollmentInput
}>, response: FastifyReply) => {
    try {
        const courseEnrolled = await studentCourseEnrollment({ ...request.body, adminId: +request.user.id })
        response.status(201).send({ message: "Student enrolled into certain course", status: 200 })

    } catch (error) {

    }

}


export const studentClassAssignmentController = async (request: FastifyRequest<{
    Body: StudentClassAssignmentInput
}>, response: FastifyReply) => {
    try {
        const classAssigned = await studentClassAssignment({ ...request.body, adminId: +request.user.id })
        if (classAssigned) {
            const updateClassInfo = await prisma.student.update({
                where: {
                    id: request.body.studentId
                },
                data: {
                    classId: classAssigned.classId
                }
            })

            response.status(201).send({ message: "Student assigned into certain class", status: 200 })

        }

    } catch (error) {
        throw error
    }
}

//TODO:
//promotion, demotion and rentention
const promotion = (request: FastifyRequest, response: FastifyReply) => {

    // to get latest registration .length on the classassignment array then -1 to get current one
}