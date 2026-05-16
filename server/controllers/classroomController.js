import { getDashboardMetrics } from '../services/classroomService.js';

export const dashboard = async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};
