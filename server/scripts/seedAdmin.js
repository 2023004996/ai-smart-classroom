import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

const run = async () => {
  const email = 'admin@classroom.com';
  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.student.create({
    data: {
      name: 'Admin User',
      email,
      password: hashed,
      category: 'Excellent',
      performanceScore: 100,
      progress: 0,
      weakTopics: [],
      role: 'ADMIN'
    }
  });

  console.log('Admin user created');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
