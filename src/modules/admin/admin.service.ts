import prisma from "../../lib/prisma";
import { CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, CreateSubjectInput, StudentClassAssignmentInput, courseEnrollmentInput, studentCompulsorySubjectAssignment } from "./adminSchema";
import { hashPassword } from "../../auth/password";
import HttpException from "../../schema/error";

//DATABASE INTERACTIONS AND CUSTOM FUNCTIONS
export async function createTeacher(data: CreateTeacherInput & { adminId: number }) {
    const password = await hashPassword(data.password)

    return await prisma.teacher.create({
        data: {
            password: password,
            firstName: data.firstName,
            lastName: data.lastName,
            active: data.active,
            phonenumber: data.phonenumber,
            adminId: data.adminId,
            middleName: data.middleName
        }
    })
}


export async function createSubject(data: CreateSubjectInput & { adminId: number }) {
    return await prisma.subject.create({
        data: data


    })
}



export async function AssignSubject(data: AssignSubjectInput & { adminId: number }) {
    return await prisma.subjectAssigned.create({
        data: data


    })
}

export async function studentClassAssignment(data: StudentClassAssignmentInput & { adminId: number }) {
    return await prisma.classAssignment.create({
        data: data
    })
}



type SafeStudentType = Omit<CreateStudentInput, "classId" | "sessionId">

export async function checkIfStudentExists(data: SafeStudentType) {
    const student = await prisma.student.findUnique({
        where: {
            fullName: {
                firstName: data.firstName,
                lastName: data.lastName,
                phonenumber: data.phonenumber,
                motherMaidenName: data.motherMaidenName
            }
        }
    })

}

export async function createStudent(data: SafeStudentType & { adminId: number }) {
    const password = await hashPassword(data.password)

    return await prisma.student.create({
        data: {
            ...data,
            password: password,

        }
    })
}

export async function createClass(data: CreateClassInput & { adminId: number }) {
    return await prisma.class.create({
        data: {
            ...data
        }
    })
}

export async function studentCourseEnrollment(data: courseEnrollmentInput & { adminId: number }) {
    return await prisma.courseEnrollment.create({
        data: data
    })
}


export async function studentCompulsoryCourseEnrollment(data: studentCompulsorySubjectAssignment & { classId: number, adminId: number }) {
    const subjects = await prisma.class.findUnique({
        where: {
            id: data.classId
        },
        select: {
            subjects: true
        }
    })

    if (!subjects) throw new HttpException(500, "Subjects can't be fetched")

    const promises = await Promise.all(subjects.subjects.map(subject => studentCourseEnrollment({ ...data, subjectId: subject.id })))

    return promises



}

/////GET CURRENT SESSION
export async function getCurrentSessionFromConstant(constantName: string) {
    const sessionId = await prisma.constant.findUnique({
        where: {
            key: constantName
        }
    })

    if (sessionId) {


        const currentSession = await prisma.session.findUnique({
            where: {
                id: +sessionId.value
            }
        })

        return currentSession
    }

}


export async function getCurrentSession(id: string) {

    return await prisma.session.findUnique({
        where: {
            id: +id
        }
    })

}


export async function getCurrentClass(studentId: number) {
    return await prisma.student.findUnique({
        where: {
            id: studentId
        },
        select: {
            classId: true,
            ClassAssignment: true,
            CurrentClass: {
                select: {
                    classLevel: true
                }
            }

        }
    })

}