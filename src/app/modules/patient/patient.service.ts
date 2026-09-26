import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';

const createPatientIntoDB = async (payload: IPatient) => {
  const patient = await Patient.create(payload);
  return patient;
};

const getAllPatientsFromDB = async (query: Record<string, unknown>) => {
  const patientQuery = new QueryBuilder(Patient.find().populate('doctorId'), query)
    .search(['name', 'email', 'phone', 'diagnosis'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await patientQuery.modelQuery;
  const meta = await patientQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSinglePatientFromDB = async (id: string) => {
  const result = await Patient.findById(id).populate('doctorId');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  return result;
};

const updatePatientIntoDB = async (id: string, payload: Partial<IPatient>) => {
  const isPatientExists = await Patient.findById(id);
  if (!isPatientExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  const result = await Patient.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('doctorId');
  return result;
};

const deletePatientFromDB = async (id: string) => {
  const isPatientExists = await Patient.findById(id);
  if (!isPatientExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  const result = await Patient.findByIdAndDelete(id);
  return result;
};

export const PatientServices = {
  createPatientIntoDB,
  getAllPatientsFromDB,
  getSinglePatientFromDB,
  updatePatientIntoDB,
  deletePatientFromDB,
};
