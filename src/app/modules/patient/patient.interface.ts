import { Model, Types } from 'mongoose';

export interface IPatient {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  condition: string;
  doctorId: Types.ObjectId;
  diagnosis: string;
}

export type PatientModel = Model<IPatient>;
