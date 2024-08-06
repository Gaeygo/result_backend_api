import prisma from "../../lib/prisma";
import { CreateClassInput, CreateStudentInput, AssignSubjectInput, CreateTeacherInput, CreateSubjectInput, StudentClassAssignmentInput, courseEnrollmentInput, studentCompulsorySubjectAssignment } from "./adminSchema";
import { hashPassword } from "../../auth/password";
import HttpException from "../../schema/error";
import { Term } from "@prisma/client";

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

/////GET CURRENT SESSION
export async function getCurrentSessionFromConstant() {
    const sessionId = await prisma.constant.findUnique({
        where: {
            key: "CURRENT_SESSION"
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


export async function getSession(id: number) {

    return await prisma.session.findUnique({
        where: {
            id: +id
        }
    })

}

export const addSessionAsConstant = async (
    newSessionId:  number,
    adminId: number
) => {
    // Check if the new session exists
    const sessionCheck = await getSession(newSessionId);
    if (!sessionCheck) {
        throw new HttpException(400, "Session does not exist");
    }

    // Check if the new session's close date has elapsed
    if (new Date(sessionCheck.closeDate).getTime() < Date.now()) {
        throw new HttpException(400, "New session's close date has already elapsed");
    }

    const currentSession = await getCurrentSessionFromConstant();

    // if(currentSession && new Date(currentSession?.closeDate).getTime() > new Date(sessionCheck.closeDate).getTime()) throw new HttpException(400, "Current session is yet to elasp")

    if (!currentSession) {
        // Create a new constant if no current session exists
        const currentSessionInit = await prisma.constant.create({
            data: {
                key: "CURRENT_SESSION",
                value: newSessionId.toString(),
                adminId: adminId
            }
        });
        return currentSessionInit;
    } else {
        // Check if the current session's close date has elapsed
        if (new Date(currentSession.closeDate).getTime() > Date.now()) {
            throw new HttpException(400, "Cannot change current session before its close date");
        }

        // Update the existing constant
        const assignSession = await prisma.constant.update({
            where: {
                key: "CURRENT_SESSION"
            },
            data: {
                value: newSessionId.toString()
            }
        });
        return assignSession;
    }
};






interface TermData {
  termId: number;
  startDate: string;
  endDate: string;
}



export async function setCurrentTerm(termData: TermData): Promise<{ success: boolean; message: string }> {
  const { termId, startDate, endDate } = termData;
  const now = new Date();

  try {
    // Check if the term exists
    const term = await prisma.term.findUnique({ where: { id: termId } });
    if (!term) {
      return { success: false, message: 'Term not found' };
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start >= end) {
      return { success: false, message: 'Start date must be before end date' };
    }

    // Check if there's an existing current term
    const currentTermConstant = await prisma.constant.findUnique({ where: { key: 'CURRENT_TERM' } });

    if (currentTermConstant) {
      const currentTerm = await prisma.term.findUnique({ where: { id: parseInt(currentTermConstant.value) } });
      if (currentTerm) {
        const currentEnd = new Date(currentTerm.closedDate);
        
        // If current term hasn't ended yet, don't allow change
        if (now < currentEnd) {
          return { success: false, message: 'Cannot change current term before it ends' };
        }
      }
    }

    // If the new term has already started, don't allow change
    if (now > start) {
      return { success: false, message: 'Cannot set a term that has already started' };
    }

    // Update or create the CURRENT_TERM constant
    await prisma.constant.upsert({
      where: { key: 'CURRENT_TERM' },
      update: { value: termId.toString() },
      create: { key: 'CURRENT_TERM', value: termId.toString(), adminId: 1 } // Assuming admin ID 1 for simplicity
    });

    // Update the term dates
    await prisma.term.update({
      where: { id: termId },
      data: { openDate: start, closedDate: end }
    });

    return { success: true, message: 'Current term updated successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function getCurrentTerm(): Promise<{ success: boolean; term?: Term; message?: string }> {
  try {
    const currentTermConstant = await prisma.constant.findUnique({ where: { key: 'CURRENT_TERM' } });
    if (!currentTermConstant) {
      return { success: false, message: 'No current term set' };
    }

    const currentTerm = await prisma.term.findUnique({ where: { id: parseInt(currentTermConstant.value) } });
    if (!currentTerm) {
      return { success: false, message: 'Current term not found' };
    }

    return { success: true, term: currentTerm };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error' };
  }
}