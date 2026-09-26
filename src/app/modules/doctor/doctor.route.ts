import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { DoctorControllers } from './doctor.controller';
import { DoctorValidations } from './doctor.validation';

const router = express.Router();

router.post(
    '/',
    validateRequest(DoctorValidations.createDoctorValidationSchema),
    DoctorControllers.createDoctor
);

router.get('/', DoctorControllers.getAllDoctors);

router.get('/:id', DoctorControllers.getSingleDoctor);

router.patch(
    '/:id',
    validateRequest(DoctorValidations.updateDoctorValidationSchema),
    DoctorControllers.updateDoctor
);

router.delete('/:id', DoctorControllers.deleteDoctor);

router.get('/:id/patients', DoctorControllers.getDoctorPatients);

router.post(
    '/:id/patients',
    validateRequest(DoctorValidations.addPatientValidationSchema),
    DoctorControllers.addPatientToDoctor
);

router.delete('/:id/patients/:patientId', DoctorControllers.removePatientFromDoctor);

export const DoctorRoutes = router;
