import { faker } from '@faker-js/faker';
import { hashPassword } from "../auth/password";
import { CreateStudentInput, AssignSubjectInput, CreateTeacherInput, AdminCreateInput, CreateClassInput } from "../modules/admin/adminSchema"
import { z } from 'zod';




const NGgradeEnum = z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"])

type ClassLevel = z.infer<typeof NGgradeEnum>

const getRandomClassLevel = (): ClassLevel => {
    const enumValues = NGgradeEnum.options;
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
};

// Example usage:

const createRandomStudent = (): CreateStudentInput => {
    return {
        active: faker.datatype.boolean(),
        firstName: faker.person.firstName(),
        middleName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
        phonenumber: faker.phone.number(),
        classId: faker.number.int({ max: 5, min: 1 }),
    }
}

//generate class

const createClass = (): CreateClassInput => {
    return {
        active: faker.datatype.boolean(),
        classLevel: getRandomClassLevel(),
        name: faker.lorem.word()

    }
}

// const createTeacher = (): CreateTeacherInput => {

// }

const createSubject = () => {
    
}