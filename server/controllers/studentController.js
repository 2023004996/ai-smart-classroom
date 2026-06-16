import prisma from '../config/db.js';
import { calculateCategory } from '../services/categorizationService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Get latest quiz result
    const latestResult = await prisma.result.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: { quiz: { select: { title: true } } }
    });

    // Get assigned tasks
    const tasks = await prisma.task.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get total lessons/doubts (for context)
    const doubtCount = await prisma.doubt.count({
      where: { studentId }
    });

    const dashboardData = {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        category: student.category || 'Average',
        performanceScore: student.performanceScore,
        progress: student.progress
      },
      latestQuizScore: latestResult
        ? {
            score: latestResult.score,
            quizTitle: latestResult.quiz.title,
            completionTime: latestResult.completionTime,
            date: latestResult.createdAt
          }
        : null,
      assignedTasks: tasks.length > 0 ? tasks : [],
      stats: {
        doubtsRaised: doubtCount
      }
    };

    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
};

export const updatePerformanceScore = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { performanceScore } = req.body;

    if (performanceScore === undefined || performanceScore === null) {
      return res.status(400).json({ message: 'Performance score is required.' });
    }

    const numericScore = Number(performanceScore);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      return res.status(400).json({ message: 'Performance score must be a number between 0 and 100.' });
    }

    const category = calculateCategory(numericScore);

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        performanceScore: numericScore,
        category
      }
    });

    res.json({
      id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      category: updatedStudent.category,
      performanceScore: updatedStudent.performanceScore,
      progress: updatedStudent.progress
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentCategory = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        category: true,
        performanceScore: true
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};
