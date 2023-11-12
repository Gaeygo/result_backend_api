import { Class } from "@prisma/client";
import prisma from "../../lib/prisma";
import { CreateClassInput, CreateStudentInput, CreateSubjectInput, CreateTeacherInput } from "./adminSchema";

//DATABASE INTERACTIONS AND CUSTOM FUNCTIONS
export async function createTeacher(data: CreateTeacherInput & { adminId: number }) {
    return await prisma.teacher.create({
        data: data
    })
}


export async function createSubject(data: CreateSubjectInput & { adminId: number }) {
    return await prisma.subject.create({
        data: data
    })
}

export async function createStudent(data: CreateStudentInput & { adminId: number }) {
    return await prisma.student.create({
        data: {
            ...data
        }
    })
}

export async function createClass(data: CreateClassInput& { adminId: number }) {
    return await prisma.class.create({
        data: {
            ...data
        }
    })
}