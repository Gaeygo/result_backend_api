import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prisma";
import { ClassActionEnum, StudentClassAssignmentInput, StudentClassPlacementInput, courseEnrollmentInput, studentCompulsorySubjectAssignment } from "./adminSchema";
import { getCurrentClass, studentClassAssignment, studentCompulsoryCourseEnrollment, studentCourseEnrollment } from "./admin.service";
import HttpException from "../../schema/error";
import { ClassLevel } from "@prisma/client";



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
 ////from frontend only classes that belong to classToBeAssignedTo will be seen to assigned a class to them////
 ////have to verify the "action"///// so input doesn't violate it
 ///then also for students that action has been carried out on them they will be grayed out, to prevent interaction

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

//TODO:STORE CLASS FORMAT IN .ENV FILE
//promotion, demotion and rentention
//["GRADE7", "GRADE8", "GRADE9", "GRADE10", "GRADE11", "GRADE12"]
//["JSS1", "JSS2", "JSS3"]
//["SS1", "SS2", "SS3"]

//class to be assigned to 
//then next session class placement is done
////or/////
//do everything in a single go
////or///
//have a badge that says promotion/retention/demotion and automatically permform that action in the next session


const studentClassManagement = async (request: FastifyRequest<{
    Body: StudentClassPlacementInput
}>, response: FastifyReply) => {
    //make it only available after session 
    //but add field to database that shows if the student gets retain/demote/promote and that will be done be head class teacher

    // when 3rd term/ session has ended

    // 

    // to get latest registration .length on the classassignment array then -1 to get current one

    const studentNewLevel = await manageStudentLevelLogic(request.body)

    const studentNewLevelAndActionSaved = await alterStudentEndOfSessionField(+request.body.studentId, studentNewLevel, request.body.action)


    //remove student from previous class and assign to new class
    //alter student tobeassigedclass field

    response.status(200).send({ message: "success, new stdent class level is saved to database and action is saved", status: 200 })



}
const junior = ['JSS1', 'JSS2', 'JSS3'] as const;
const senior = ['SS1', 'SS2', 'SS3'] as const;

// export type ClassLevel = (typeof junior)[number] | (typeof senior)[number];




const manageStudentLevelLogic = async (data: StudentClassPlacementInput): Promise<ClassLevel> => {
    try {
        const studentCurrentClassData = await getCurrentClass(+data.studentId)
        if (!studentCurrentClassData?.CurrentClass) throw new HttpException(400, "invalid class request")
        const currentLevel = studentCurrentClassData.CurrentClass.classLevel
        const { level, index } = determineClassLevelWithIndex(currentLevel);

        switch (data.action) {
            case 'PROMOTE':
                if (level === 'junior' && index < 2) {
                    return junior[index + 1];
                } else if (level === 'junior' && index === 2) {
                    return senior[0];
                } else if (level === 'senior' && index < 2) {
                    return senior[index + 1];
                } else {
                    return currentLevel; // SS3 can't be promoted
                }

            case 'DEMOTE':
                if (level === 'junior' && index > 0) {
                    return junior[index - 1];
                } else if (level === 'senior' && index > 0) {
                    return senior[index - 1];
                } else if (level === 'senior' && index === 0) {
                    return junior[2];
                } else {
                    return currentLevel; // JSS1 can't be demoted
                }

            case 'RETAIN':
                return currentLevel;

            default:
                throw new HttpException(400, 'Invalid action');
        }
    } catch (error) {
        throw error
    }


}

const alterStudentEndOfSessionField = async (studentId: number, classToBeAssignedTo: ClassLevel, endOfSessionAction: ClassActionEnum) => {
    return await prisma.student.update({
        where: {
            id: studentId,
        },
        data: {
            classToBeAssignedTo,
            endOfSessionAction
        }
    })
}

//assign new class to student 
//draw compare class to classtobeassignedto field and verify that the initial action chosen is what is being done PROMOTE/DEMOTE...
//route studentClassAssignmentController


function determineClassLevelWithIndex(input: ClassLevel): { level: 'junior' | 'senior', index: number } {
    const juniorIndex = junior.indexOf(input as any);
    if (juniorIndex !== -1) {
        return { level: 'junior', index: juniorIndex };
    }

    const seniorIndex = senior.indexOf(input as any);
    if (seniorIndex !== -1) {
        return { level: 'senior', index: seniorIndex };
    }

    throw new HttpException(400, 'Invalid input');
}


