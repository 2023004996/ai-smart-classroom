import prisma from '../config/db.js';

export const createSubject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Subject name is required.' });
    }

    const trimmedName = name.trim();

    // Check duplicate name
    const existing = await prisma.subject.findUnique({
      where: { name: trimmedName }
    });

    if (existing) {
      return res.status(400).json({ message: 'Subject name already exists.' });
    }

    const subject = await prisma.subject.create({
      data: {
        name: trimmedName,
        description: description ? description.trim() : null
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const subjectId = parseInt(id, 10);
    if (isNaN(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID.' });
    }

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    const updateData = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({ message: 'Subject name cannot be empty.' });
      }

      // Check unique constraints for name
      const existing = await prisma.subject.findFirst({
        where: {
          name: trimmedName,
          id: { not: subjectId }
        }
      });

      if (existing) {
        return res.status(400).json({ message: 'Subject name already exists.' });
      }

      updateData.name = trimmedName;
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: updateData
    });

    res.json(updatedSubject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subjectId = parseInt(id, 10);
    if (isNaN(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID.' });
    }

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    // Soft delete by setting isActive to false
    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { isActive: false }
    });

    res.json({ message: 'Subject deactivated successfully.', subject: updatedSubject });
  } catch (error) {
    next(error);
  }
};
