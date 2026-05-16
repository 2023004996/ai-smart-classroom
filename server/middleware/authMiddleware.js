import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await prisma.student.findUnique({ where: { id: decoded.id } });
    if (!student) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    req.user = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed.' });
  }
};
