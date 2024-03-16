/* spell-checker: disable */
import { randomUUID } from 'node:crypto';

import { randAvatar, randFullAddress, randPastDate, randPhoneNumber } from '@ngneat/falso';
import { Gender, Prisma, PrismaClient, Role } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const CURRENT_DATE = DateTime.utc().toJSDate();
const SEED_USER = 'seed';

const USERS: Prisma.UserCreateInput[] = [
  {
    uuid: randomUUID(),
    gender: Gender.UNDEFINED,
    firstName: 'Jane',
    lastName: 'Doe',
    birthDate: randPastDate(),
    username: 'janedoe',
    email: 'hello@janedoe.com',
    phoneNumber: randPhoneNumber(),
    address: randFullAddress(),
    profilePicUrl: randAvatar(),
    passwordHash: '$argon2id$v=19$m=4096,t=3,p=1$SnlvMThQRzN5cWhoWnkySQ$YOsVi7+r5v8ngtUmfBNCJpv3Nx/Om6s2nvfEOgSqgKs',
    verified: true,
    enabled: true,
    roles: Array.of(Role.ADMIN),
    createdAt: CURRENT_DATE,
    createdBy: SEED_USER,
    updatedAt: CURRENT_DATE,
    updatedBy: SEED_USER
  }
];

const main = async (): Promise<void> => {
  try {
    USERS.forEach(async user => {
      await prisma.user.create({
        data: user
      });
    });
  } catch {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
