import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { PatientControllers } from './patient.controller';
import { PatientValidations } from './patient.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/',
  auth('admin'), validateRequest(PatientValidations.createPatientValidationSchema),
  PatientControllers.createPatient
);

router.get('/', auth('admin'), PatientControllers.getAllPatients);

router.get('/:id', auth('admin'), PatientControllers.getSinglePatient);

router.patch(
  '/:id',
  auth('admin'), validateRequest(PatientValidations.updatePatientValidationSchema),
  PatientControllers.updatePatient
);

router.delete('/:id', auth('admin'), PatientControllers.deletePatient);

export const PatientRoutes = router;
