import prisma from '../config/db.js';

export const getDashboardMetrics = async () => {
  const quizCount = await prisma.quiz.count();
  const studentCount = await prisma.student.count();
  const completedLessons = await prisma.result.count();

  return {
    courseCount: quizCount,
    studentCount,
    completedLessons
  };
};
