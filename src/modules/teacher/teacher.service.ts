import { Term } from "@prisma/client";
import prisma from "../../lib/prisma";
import HttpException from "../../schema/error";

export const submitGrade = async (courseEnrollmentId: string, subjectAssignedId: string, gradeValue: number, tutorNote: string | undefined, currentTerm: Term) => {
    const gradesAddedDetails = await prisma.courseEnrollment.update({
        where: {
            id: courseEnrollmentId,
            subjectId: subjectAssignedId
        },
        data: {
            termResults: {
                create: {
                    grade: gradeValue,
                    tutorNote: tutorNote,
                    //addreal term id    
                    termId: currentTerm.id

                }

            }
        }
    })
    return gradesAddedDetails

}




type SubjectAssignedDetailsInput = {
    subjectAssignedId: string;
    sessionId: number;
    termId: number;
    teacherId: number;
};

type StudentGrade = {
    studentId: number;
    studentName: string;
    grade: number | null;
    tutorNote: string | null;
};

export type SubjectAssignedDetailsOutput = {
    subjectId: string;
    subjectName: string;
    className: string;
    classLevel: string;
    students: StudentGrade[];
} | null;

export const fetchSubjectAssignedDetails = async ({
    //term id shouldn't be parsed it is set generally change that
    subjectAssignedId,
    sessionId,
    termId,
    teacherId
}: SubjectAssignedDetailsInput): Promise<SubjectAssignedDetailsOutput> => {
    try {
        const subjectAssignedDetails = await prisma.subjectAssigned.findUnique({
            where: {
                id: subjectAssignedId,
                teacherId: teacherId,
            },
            include: {
                Subject: true,
                class: true,
                courseEnrollments: {
                    where: {
                        sessionId: sessionId,
                    },
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                            },
                        },
                        termResults: {
                            where: {
                                termId: termId,
                            },
                        },
                    },
                },
            },
        });

        if (!subjectAssignedDetails) {
            return null;
        }

        return {
            subjectId: subjectAssignedDetails.id,
            subjectName: subjectAssignedDetails.Subject.name,
            className: subjectAssignedDetails.class.name,
            classLevel: subjectAssignedDetails.class.classLevel,
            students: subjectAssignedDetails.courseEnrollments.map(enrollment => ({
                studentId: enrollment.student.id,
                studentName: `${enrollment.student.lastName} ${enrollment.student.firstName} ${enrollment.student.middleName || ''}`.trim(),
                grade: enrollment.termResults[0]?.grade || null,
                tutorNote: enrollment.termResults[0]?.tutorNote || null,
            })),
        };
    } catch (error) {
        console.error('Error fetching subject assigned details:', error);
        throw new HttpException(500,'Failed to fetch subject assigned details');
    }
}