import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const createToken = (student) => {
  return jwt.sign({ id: student.id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async ({ name, email, password }) => {
  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email is already registered.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: hashedPassword,
      category: 'Average',
      performanceScore: 0,
      progress: 0,
      weakTopics: []
    }
  });
  const token = createToken(student);

  return { user: { id: student.id, name: student.name, email: student.email }, token };
};

export const loginUser = async (email, password) => {
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, student.password);
  if (!isValidPassword) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const token = createToken(student);
  return { user: { id: student.id, name: student.name, email: student.email }, token };
};
