import "dotenv/config";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const dbPath = process.env.PRISMA_CLIENT_DATABASE_URL;
if (!dbPath) {
  throw new Error("Environment variable SSDATABASE_URL not defined!!");
}

const adapter = new PrismaBetterSQLite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { name: "alice" },
      { name: "bob" },
      { name: "charlie" },
      { name: "devin" },
    ],
  });

  console.log("created users:", users);
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
