import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';

const getDashboardStats = async () => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const criticalPatients = await Patient.countDocuments({ condition: 'Critical' });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const newPatientsThisMonth = await Patient.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const patientsPerDoctorAgg = await Patient.aggregate([
    {
      $group: {
        _id: '$doctorId',
        patientCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    {
      $unwind: '$doctor',
    },
    {
      $project: {
        _id: 0,
        doctorName: '$doctor.name',
        patientCount: 1,
      },
    },
  ]);

  const conditionsAgg = await Patient.aggregate([
    {
      $group: {
        _id: '$condition',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        condition: '$_id',
        count: 1,
      },
    },
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const patientsByMonthAgg = await Patient.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        monthIndex: '$_id',
        count: 1,
      },
    },
    { $sort: { monthIndex: 1 } },
  ]);

  const patientsByMonth = patientsByMonthAgg.map((item) => ({
    month: months[item.monthIndex - 1],
    count: item.count,
  }));

  const specializationAgg = await Doctor.aggregate([
    {
      $group: {
        _id: '$specialization',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        specialization: '$_id',
        count: 1,
      },
    },
  ]);

  return {
    totalDoctors,
    totalPatients,
    criticalPatients,
    newPatientsThisMonth,
    patientsPerDoctor: patientsPerDoctorAgg,
    patientsByCondition: conditionsAgg,
    patientsByMonth,
    doctorSpecializationDistribution: specializationAgg,
  };
};

export const DashboardServices = {
  getDashboardStats,
};
