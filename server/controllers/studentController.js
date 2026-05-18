import prisma from '../config/db.js';

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
