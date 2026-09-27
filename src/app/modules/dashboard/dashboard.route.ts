import express from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlwares/auth';

const router = express.Router();

router.get('/stats', auth('admin'), DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
