import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { generateGenre } from './seeds/genre';
import { generateMovie } from './seeds/movie';
import { generatePeople } from './seeds/people';
import {
  generateNowPlayingMovies,
  generatePopularMovies,
  generateTopRatedMovies,
  generateTrendingDayMovies,
  generateTrendingWeekMovies,
  generateUpcomingMovies,
} from './seeds/movie-option';

const prisma = new PrismaClient();

async function main() {
  const API_KEY = dotenv.config().parsed.THEMOVIEDB_API_KEY;
  if (!API_KEY) {
    throw new Error('THEMOVIEDB_API_KEY is not set in .env file');
  }

  // All good, let's seed the database
  await generateGenre(API_KEY);
  await generateNowPlayingMovies();
  await generatePopularMovies();
  await generateTopRatedMovies();
  await generateUpcomingMovies();
  await generateTrendingDayMovies();
  await generateTrendingWeekMovies();
  await generatePeople();
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
