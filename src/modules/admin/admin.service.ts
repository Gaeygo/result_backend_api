import prisma from "../../lib/prisma";
import { CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, CreateSubjectInput } from "./adminSchema";
import { hashPassword } from "../../auth/password";

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

export async function createStudent(data: CreateStudentInput & { adminId: number }) {
    const password = await hashPassword(data.password)

    return await prisma.student.create({
        data: {
            ...data,
            password: password
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