-- CreateTable
CREATE TABLE "IdGenerationStudentLog" (
    "id" SERIAL NOT NULL,
    "generatedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "IdGenerationStudentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdGenerationTeacherLog" (
    "id" SERIAL NOT NULL,
    "generatedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "IdGenerationTeacherLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdGenerationStudentLog_studentId_key" ON "IdGenerationStudentLog"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IdGenerationTeacherLog_teacherId_key" ON "IdGenerationTeacherLog"("teacherId");

-- AddForeignKey
ALTER TABLE "IdGenerationStudentLog" ADD CONSTRAINT "IdGenerationStudentLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdGenerationTeacherLog" ADD CONSTRAINT "IdGenerationTeacherLog_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
