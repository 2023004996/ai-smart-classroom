import { loginUser, registerUser } from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const data = await registerUser({ name, email, password, role });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const student = req.user;
    if (!student) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const { id, name, email, category, performanceScore, progress, role } = student;
    res.json({ user: { id, name, email, category, performanceScore, progress, role } });
  } catch (error) {
    next(error);
  }
};
