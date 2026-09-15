const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const email = "sciencelabhoorn@icloud.com";
  const password = "Geheim12345";
  const username = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "admin",
    },
    create: {
      email,
      username,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`Admin-account klaar: ${user.email} (rol: ${user.role})`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
