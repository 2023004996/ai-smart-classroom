import prisma from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const totalStudents = await prisma.student.count();

    const avgAgg = await prisma.student.aggregate({ _avg: { performanceScore: true } });
    const averagePerformance = Number((avgAgg._avg.performanceScore || 0).toFixed(2));

    const below = await prisma.student.count({ where: { performanceScore: { lte: 40 } } });
    const average = await prisma.student.count({ where: { performanceScore: { gte: 41, lte: 65 } } });
    const above = await prisma.student.count({ where: { performanceScore: { gte: 66, lte: 85 } } });
    const excellent = await prisma.student.count({ where: { performanceScore: { gte: 86 } } });

    const categoryDistribution = {
      belowAverage: below,
      average: average,
      aboveAverage: above,
      excellent: excellent
    };

    res.json({ totalStudents, averagePerformance, categoryDistribution });
  } catch (error) {
    next(error);
  }
};
