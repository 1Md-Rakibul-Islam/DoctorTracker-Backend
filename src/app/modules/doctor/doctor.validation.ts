import { z } from 'zod';

const createDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    specialization: z.string({ required_error: 'Specialization is required' }),
    hospital: z.string({ required_error: 'Hospital is required' }),
    phone: z.string({ required_error: 'Phone number is required' }).regex(/^\+?[0-9\-\s\(\)]+$/, 'Invalid phone number format'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
  }),
});

const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    specialization: z.string().optional(),
    hospital: z.string().optional(),
    phone: z.string().regex(/^\+?[0-9\-\s\(\)]+$/, 'Invalid phone number format').optional(),
    email: z.string().email('Invalid email format').optional(),
  }),
});

const addPatientValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Patient name is required' }),
  }).passthrough(),
});

export const DoctorValidations = {
  createDoctorValidationSchema,
  updateDoctorValidationSchema,
  addPatientValidationSchema,
};
