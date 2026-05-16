import { askAI } from '../services/aiService.js';

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const answer = await askAI(message, req.user);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
};
