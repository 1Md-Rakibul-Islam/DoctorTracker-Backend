import { Model } from 'mongoose';

export interface IDoctor {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export type DoctorModel = Model<IDoctor>;
