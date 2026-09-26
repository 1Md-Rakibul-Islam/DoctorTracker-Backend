import express from 'express';
import { DashboardControllers } from './dashboard.controller';

const router = express.Router();

router.get('/stats', DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
