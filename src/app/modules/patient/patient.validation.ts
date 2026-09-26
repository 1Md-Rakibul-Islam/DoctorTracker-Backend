import { z } from 'zod';

const createPatientValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    age: z.number({ required_error: 'Age is required' }),
    gender: z.string({ required_error: 'Gender is required' }),
    phone: z.string({ required_error: 'Phone number is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    address: z.string({ required_error: 'Address is required' }),
    condition: z.string({ required_error: 'Condition is required' }),
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    diagnosis: z.string({ required_error: 'Diagnosis is required' }),
  }),
});

const updatePatientValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    address: z.string().optional(),
    condition: z.string().optional(),
    doctorId: z.string().optional(),
    diagnosis: z.string().optional(),
  }),
});

export const PatientValidations = {
  createPatientValidationSchema,
  updatePatientValidationSchema,
};
