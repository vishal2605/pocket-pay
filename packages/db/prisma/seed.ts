import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' }, // ✅ use email for lookup
    update: {},
    create: {
      email: 'alice@example.com',          // ✅ required for unique constraint
      password: await bcrypt.hash('alice', 10),
      firstname: 'Alice',
      lastname: 'User',
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: 'Success',
          amount: 20000,
          token: 'token__1',
          provider: 'HDFC Bank',
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: await bcrypt.hash('bob', 10),
      firstname: 'Bob',
      lastname: 'User',
      Balance: {
        create: {
          amount: 2000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: 'Failure',
          amount: 2000,
          token: 'token__2',
          provider: 'HDFC Bank',
        },
      },
    },
  });

  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
