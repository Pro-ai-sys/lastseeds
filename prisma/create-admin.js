const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const username = process.argv[4] || "admin";

  if (!email || !password) {
    console.log(
      "Gebruik: node prisma/create-admin.js <email> <wachtwoord> [gebruikersnaam]"
    );
    return;
  }

  if (password.length < 8) {
    console.log("Wachtwoord moet minimaal 8 tekens zijn.");
    return;
  }

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
