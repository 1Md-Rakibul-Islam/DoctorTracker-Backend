import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import auth from '../../middlwares/auth';
import { DoctorControllers } from './doctor.controller';
import { DoctorValidations } from './doctor.validation';

const router = express.Router();

router.post(
    '/',
    auth('admin'),
    validateRequest(DoctorValidations.createDoctorValidationSchema),
    DoctorControllers.createDoctor
);

router.get('/', auth('admin'), DoctorControllers.getAllDoctors);

router.get('/:id', auth('admin'), DoctorControllers.getSingleDoctor);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(DoctorValidations.updateDoctorValidationSchema),
    DoctorControllers.updateDoctor
);

router.delete('/:id', auth('admin'), DoctorControllers.deleteDoctor);

router.get('/:id/patients', auth('admin'), DoctorControllers.getDoctorPatients);

router.post(
    '/:id/patients',
    auth('admin'),
    validateRequest(DoctorValidations.addPatientValidationSchema),
    DoctorControllers.addPatientToDoctor
);

router.delete('/:id/patients/:patientId', auth('admin'), DoctorControllers.removePatientFromDoctor);

export const DoctorRoutes = router;
