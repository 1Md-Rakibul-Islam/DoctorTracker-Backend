import { Schema, model } from 'mongoose';
import { IPatient, PatientModel } from './patient.interface';

const patientSchema = new Schema<IPatient, PatientModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    age: { type: Number, required: [true, 'Age is required'] },
    gender: { type: String, required: [true, 'Gender is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    address: { type: String, required: [true, 'Address is required'] },
    condition: { type: String, required: [true, 'Condition is required'] },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: [true, 'Doctor ID is required'] },
    diagnosis: { type: String, required: [true, 'Diagnosis is required'] },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ name: 'text', email: 'text', phone: 'text', diagnosis: 'text' });
patientSchema.index({ doctorId: 1 });
patientSchema.index({ email: 1 }, { unique: true });
patientSchema.index({ createdAt: 1 });

export const Patient = model<IPatient, PatientModel>('Patient', patientSchema);
