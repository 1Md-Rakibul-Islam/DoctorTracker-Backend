import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import User from "./user.model";
import { generateStudenId } from "./user.utils";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createStudentIntoDb = async (password: string, payload: TStudent) => {

  // create a new user
  const userData: Partial<TUser> = {};

  // if password not provided then set default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = "student";

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    // auto generate student id m
    userData.id = await generateStudenId(admissionSemester as TAcademicSemester);

    // create a user [transition 1]
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create a student
    const newStudent = await Student.create([payload], { session }); // array

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  } catch (error: any) {

    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }

};

export const UserServices = {
  createStudentIntoDb,
};
