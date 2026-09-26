import { Schema, model } from 'mongoose';
import { IDoctor, DoctorModel } from './doctor.interface';

const doctorSchema = new Schema<IDoctor, DoctorModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    hospital: {
      type: String,
      required: [true, 'Hospital is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
doctorSchema.index({ name: 'text', specialization: 'text', hospital: 'text' });
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ createdAt: 1 });

export const Doctor = model<IDoctor, DoctorModel>('Doctor', doctorSchema);
