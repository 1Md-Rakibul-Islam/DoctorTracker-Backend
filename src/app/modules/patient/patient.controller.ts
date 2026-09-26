import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PatientServices } from './patient.service';

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientServices.createPatientIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient is created successfully',
    data: result,
  });
});

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientServices.getAllPatientsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientServices.getSinglePatientFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient is retrieved successfully',
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientServices.updatePatientIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient is updated successfully',
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientServices.deletePatientFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient is deleted successfully',
    data: result,
  });
});

export const PatientControllers = {
  createPatient,
  getAllPatients,
  getSinglePatient,
  updatePatient,
  deletePatient,
};
