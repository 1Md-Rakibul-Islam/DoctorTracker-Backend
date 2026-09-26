import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { PatientControllers } from './patient.controller';
import { PatientValidations } from './patient.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(PatientValidations.createPatientValidationSchema),
  PatientControllers.createPatient
);

router.get('/', PatientControllers.getAllPatients);

router.get('/:id', PatientControllers.getSinglePatient);

router.patch(
  '/:id',
  validateRequest(PatientValidations.updatePatientValidationSchema),
  PatientControllers.updatePatient
);

router.delete('/:id', PatientControllers.deletePatient);

export const PatientRoutes = router;
