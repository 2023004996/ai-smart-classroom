export const requireAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden. Admins only.' });
  }
  next();
};

export const requireStudent = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'STUDENT') {
    return res.status(403).json({ message: 'Forbidden. Students only.' });
  }
  next();
};
