import "dotenv/config";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const dbPath = process.env.PRISMA_CLIENT_DATABASE_URL;
if (!dbPath) {
  throw new Error("Environment variable SSDATABASE_URL not defined!!");
}

const adapter = new PrismaBetterSQLite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

// The creation order MUST be:
//   OK!! 1) user -> 2) bio(connect user)
// The other way around is impossible:
//   BAD! 1) bio  -> 2) user(connect bio)
// because the bio needs userId as in schema.prisma
async function main() {
  // As described above, it is impossible to create bio ONLY in advance.
  //   const bio = await prisma.bio.create({
  //     // TypeScript Error: Property 'user' is missing in type '{ text: string; }'
  //     //                   but required in type 'BioCreateInput'.ts(2322)
  //     data: {
  //       text: "Alice's bio",
  //       // userId or user is required
  //     },
  //   });

  const aliceUser = await prisma.userWithBio.create({
    data: {
      name: "Alice",
    },
  });

  console.log("created user:", aliceUser);

  const bioAlice = await prisma.bio.create({
    data: {
      text: "Alice's Bio",
      user: {
        connectOrCreate: {
          where: {
            id: aliceUser.id,
          },
          create: {
            name: "Alice",
          },
        },
      },
    },
  });

  console.log("created bio 1:", bioAlice);

  const bioBob = await prisma.bio.create({
    data: {
      text: "Bob's Bio",
      user: {
        connectOrCreate: {
          where: {
            id: -1, //non-existent ID
          },
          create: {
            name: "Bob",
          },
        },
      },
    },
  });

  console.log("created bio 2:", bioBob);

  const foundUsers = await prisma.userWithBio.findMany({
    include: {
      bio: true,
    },
    where: {
      id: { in: [aliceUser.id, bioBob.userId] },
    },
  });

  console.log("found users:", foundUsers);
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
