import "dotenv/config";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const dbPath = process.env.PRISMA_CLIENT_DATABASE_URL;
if (!dbPath) {
  throw new Error("Environment variable SSDATABASE_URL not defined!!");
}

const adapter = new PrismaBetterSQLite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
    },
  });

  console.log("created user:", user);

  const post1 = await prisma.post.create({
    data: {
      title: "Alice's post 1",
      body: "the article body",
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log("created post:", post1);

  const post2 = await prisma.post.create({
    data: {
      title: "Alice's post 2",
      body: "the article body",
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log("created post:", post2);

  const user2 = await prisma.user.create({
    data: {
      name: "Bob",
      posts: {
        connect: [
          {
            id: post1.id,
          },
          {
            id: post2.id,
          },
        ],
      },
    },
  });

  console.log("created user:", user2);

  const foundUser = await prisma.user.findMany({
    include: {
      posts: true,
    },
    where: {
      id: { in: [user.id, user2.id] },
    },
  });

  console.log("found users:", foundUser);
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
