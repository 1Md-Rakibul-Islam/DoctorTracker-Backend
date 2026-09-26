import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';

const createDoctorIntoDB = async (payload: IDoctor) => {
    const doctor = await Doctor.create(payload);
    return doctor;
};

const getAllDoctorsFromDB = async (query: Record<string, unknown>) => {
    const doctorQuery = new QueryBuilder(Doctor.find(), query)
        .search(['name', 'specialization', 'hospital'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await doctorQuery.modelQuery;
    const meta = await doctorQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleDoctorFromDB = async (id: string) => {
    const result = await Doctor.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }
    return result;
};

const updateDoctorIntoDB = async (id: string, payload: Partial<IDoctor>) => {
    const isDoctorExists = await Doctor.findById(id);
    if (!isDoctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const result = await Doctor.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteDoctorFromDB = async (id: string) => {
    const isDoctorExists = await Doctor.findById(id);
    if (!isDoctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const Patient = mongoose.model('Patient');
        if (Patient) {
            const patientCount = await Patient.countDocuments({ doctorId: id }).session(session);
            if (patientCount > 0) {
                throw new AppError(httpStatus.CONFLICT, `Cannot delete doctor because they still have ${patientCount} patient(s) assigned.`);
            }
        }

        const result = await Doctor.findByIdAndDelete(id, { session });

        await session.commitTransaction();
        await session.endSession();
        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};

const getDoctorPatientsFromDB = async (doctorId: string, query: Record<string, unknown>) => {
    const isDoctorExists = await Doctor.findById(doctorId);
    if (!isDoctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const Patient = mongoose.model('Patient');
    if (!Patient) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Patient model not found');

    const patientQuery = new QueryBuilder(Patient.find({ doctorId }), query)
        .search(['name'])
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

const addPatientToDoctorInDB = async (doctorId: string, payload: any) => {
    const isDoctorExists = await Doctor.findById(doctorId);
    if (!isDoctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const Patient = mongoose.model('Patient');
    if (!Patient) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Patient model not found');

    const patientPayload = { ...payload, doctorId };
    const patient = await Patient.create(patientPayload);

    return patient;
};

const removePatientFromDoctorInDB = async (doctorId: string, patientId: string) => {
    const isDoctorExists = await Doctor.findById(doctorId);
    if (!isDoctorExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const Patient = mongoose.model('Patient');
    if (!Patient) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Patient model not found');

    const patient = await Patient.findOne({ _id: patientId, doctorId });
    if (!patient) {
        throw new AppError(httpStatus.NOT_FOUND, 'Patient not found under this doctor');
    }

    const result = await Patient.findByIdAndUpdate(patientId, { $unset: { doctorId: 1 } }, { new: true });
    return result;
};

export const DoctorServices = {
    createDoctorIntoDB,
    getAllDoctorsFromDB,
    getSingleDoctorFromDB,
    updateDoctorIntoDB,
    deleteDoctorFromDB,
    getDoctorPatientsFromDB,
    addPatientToDoctorInDB,
    removePatientFromDoctorInDB
};
