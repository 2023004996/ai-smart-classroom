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

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerUser({ name, email, password });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
