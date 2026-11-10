// Testni podatki: administrator, podjetje in ustvarjalec
// Zagon: npx prisma db seed
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password_hash = await bcrypt.hash('geslo123', 10);

  // upsert = ustvari, če še ne obstaja (seed lahko zaženemo večkrat)
  await prisma.user.upsert({
    where: { email: 'admin@getad.si' },
    update: {},
    create: { email: 'admin@getad.si', password_hash, role: 'admin', display_name: 'Administrator' },
  });

  await prisma.user.upsert({
    where: { email: 'company@getad.si' },
    update: {},
    create: {
      email: 'company@getad.si',
      password_hash,
      role: 'company',
      display_name: 'Testno podjetje',
      company: { create: { name: 'Testno podjetje d.o.o.', website: 'https://example.com' } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@getad.si' },
    update: {},
    create: { email: 'user@getad.si', password_hash, role: 'creator', display_name: 'Testni ustvarjalec' },
  });

  console.log('Seed končan. Geslo za vse testne račune: geslo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
