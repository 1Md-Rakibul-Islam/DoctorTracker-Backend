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

router.get('/', auth('admin', 'doctor'), DoctorControllers.getAllDoctors);

router.get('/:id', auth('admin', 'doctor'), DoctorControllers.getSingleDoctor);

router.patch(
    '/:id',
    auth('admin', 'doctor'),
    validateRequest(DoctorValidations.updateDoctorValidationSchema),
    DoctorControllers.updateDoctor
);

router.delete('/:id', auth('admin'), DoctorControllers.deleteDoctor);

router.get('/:id/patients', auth('admin', 'doctor'), DoctorControllers.getDoctorPatients);

router.post(
    '/:id/patients',
    auth('admin', 'doctor'),
    validateRequest(DoctorValidations.addPatientValidationSchema),
    DoctorControllers.addPatientToDoctor
);

router.delete('/:id/patients/:patientId', auth('admin', 'doctor'), DoctorControllers.removePatientFromDoctor);

export const DoctorRoutes = router;
