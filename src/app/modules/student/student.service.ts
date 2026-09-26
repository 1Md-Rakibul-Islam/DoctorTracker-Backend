/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import User from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  console.log("base query", query);

  /*

  const queryObj = { ...query };

  let searchTerm = "";  // SET DEFAULT VALUE s

  // IF searchTerm  IS GIVEN SET IT
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH  : 
  // { email: { $regex: query.searchTerm, $options: i } }
  // { presentAddress: { $regex: query.searchTerm, $options: i } }
  // { 'name.firstName': { $regex: query.searchTerm, $options: i } }

  const studentSearchableFields = ["email", "name.firstName", "presentAddress"];

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" }
    }))
  });

  // Filtering 
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

  excludeFields.forEach((el) => delete queryObj[el]);

  // WE ARE DYNAMICALLY DOING IT USING LOOP
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // sort
  let sort = "-createdAt";

  if (query?.sort) {
    sort = query?.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // PAGINATION FUNCTIONALITY:
  let page = 1; // SET DEFAULT VALUE FOR PAGE 
  let limit = 1; // SET DEFAULT VALUE FOR LIMIT 
  let skip = 0; // SET DEFAULT VALUE FOR SKIP

  // IF limit IS GIVEN SET IT
  if (query?.limit) {
    limit = Number(query?.limit) as number;
  }

  // IF page IS GIVEN SET IT
  if (query?.page) {
    page = Number(query?.page);
    skip = Number(page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  // FIELD LIMITING FUNCTIONALITY

  // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH 
  // fields: 'name,email';  WE ARE ACCEPTING FROM REQUEST
  // fields: 'name email';  HOW IT SHOULD BE 

  let fields = "-_v"; // SET DEFAULT VALUE FOR FIELDS

  if (query?.fields) {
    fields = (query?.fields as string).split(",").join(" ");
  }

  const fieldQuery = await limitQuery.select(fields);

  */

  const studentQuery = new QueryBuilder(Student.find(), query)
    .search(studentSearchableFields)
    .fields()
    .sort()
    .paginate()
    .fields();

  const result = studentQuery.modelQuery;

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // const result = await Student.aggregate([{ $match: { id: id } }]);

  return result;
};

const deleteStudentFromDB = async (id: string) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session: session }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session: session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedUser;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  };

};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {

  const { name, guardian, localGuardian, ...remainingStartData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStartData
  }

  /*
  guardain: {
    fatherOccupation:"Teacher"
  }
 
  guardian.fatherOccupation = Teacher
 
  name.firstName = 'Mezba'
  name.lastName = 'Abedin'
*/

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;

};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB
};
