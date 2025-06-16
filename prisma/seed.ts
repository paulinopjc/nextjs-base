import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Step 1: Create a role if it doesn't exist
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
    },
  });

  // Step 2: Create a user with that role
  const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'Admin',
      email: 'admin@test.com',
      password: 'Cloud123@',
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: {
            connect: { id: adminRole.id }, // 👈 this links the user to the role
          },
        },
      });
    }
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
