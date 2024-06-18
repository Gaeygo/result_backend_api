import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { StudentClassAssignmentInput, courseEnrollmentInput, studentCompulsorySubjectAssignment } from "./adminSchema";
import { studentClassAssignment, studentCompulsoryCourseEnrollment, studentCourseEnrollment } from "./admin.service";
import HttpException from "../../schema/error";



// first enroll in a class, then run course enrollement
//FIXME: ADD STUDENT COURSE ENROLLEMENT TO SERVICES
export const studentCourseEnrollmentController = async (request: FastifyRequest<{
    Body: courseEnrollmentInput //make it possible that course enrollment is bot term dependent and independent
}>, response: FastifyReply) => {
    try {
        //only subjects that are electives can be reassigned and only fringe cases of compulsory subjects4
        //find subject and check if it is an elective, then enroll students into it
        const isSubjectElective = await prisma.subjectAssigned.findUnique({
            where: {
                id: request.body.subjectId
            }
        })
        if (!isSubjectElective) throw new HttpException(400, "Subject does not exist")

        if (isSubjectElective.isElective === false) throw new HttpException(400, "Only elective subjects can be manually registered")

        //check if they are enrolled in the course
        const isSubjectRegistered = await prisma.courseEnrollment.findUnique({
            where: {
                checkEnrollment: {
                    studentId: request.body.studentId,
                    sessionId: request.body.sessionId,
                    subjectId: request.body.subjectId
                }
            }
        })

        if (isSubjectRegistered) throw new HttpException(400, "Subject already registered to student")

        const courseEnrolled = await studentCourseEnrollment({ ...request.body, adminId: +request.user.id })
        response.status(201).send({ message: "Student enrolled into certain course", status: 200 })

    } catch (error) {
        throw error
    }

}


export const studentClassAssignmentController = async (request: FastifyRequest<{
    Body: StudentClassAssignmentInput & studentCompulsorySubjectAssignment
}>, response: FastifyReply) => {

    try {


        const classAssigned = await studentClassAssignment({ ...request.body as StudentClassAssignmentInput, adminId: +request.user.id })
        if (classAssigned) {
            const updateClassInfo = await prisma.student.update({
                where: {
                    id: request.body.studentId
                },
                data: {
                    classId: classAssigned.classId
                }
            })
            if (updateClassInfo) {
                const registerCompulsorySubjects = await studentCompulsoryCourseEnrollment({ classId: classAssigned.classId, ...request.body as studentCompulsorySubjectAssignment, adminId: +request.user.id })

                //look through Class assigned subjects and register the ones that are not electives
                response.status(201).send({ message: "Student assigned into certain class", status: 200 })

            }



            //add default subjects to course registration after class assignment 

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