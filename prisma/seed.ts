import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { generateGenre } from './seeds/genre';
import { generateMovie } from './seeds/movie';

const prisma = new PrismaClient();

async function main() {
  const API_KEY = dotenv.config().parsed.THEMOVIEDB_API_KEY;
  if (!API_KEY) {
    throw new Error('THEMOVIEDB_API_KEY is not set in .env file');
  }

  // All good, let's seed the database
  await generateGenre(API_KEY);
  await generateMovie();
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
