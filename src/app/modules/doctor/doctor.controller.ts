import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DoctorServices } from './doctor.service';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.createDoctorIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Doctor is created successfully',
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getAllDoctorsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getSingleDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor is retrieved successfully',
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.updateDoctorIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor is updated successfully',
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.deleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor is deleted successfully',
    data: result,
  });
});

const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getDoctorPatientsFromDB(id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients of the doctor are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const addPatientToDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.addPatientToDoctorInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient added to doctor successfully',
    data: result,
  });
});

const removePatientFromDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id, patientId } = req.params;
  const result = await DoctorServices.removePatientFromDoctorInDB(id, patientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient removed from doctor successfully',
    data: result,
  });
});

export const DoctorControllers = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor
};

