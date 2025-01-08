import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { generatePersonCredit } from './person-credit';

const prisma = new PrismaClient();

export const generateMovie = async () => {
  console.log('Generating movies');

  const jsonData = await readFile('prisma/json/tmdb_db.movies_2.json', 'utf-8')
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    // first, upsert movie
    await prisma.movie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        budget: movie.budget,
        categories: movie.categories.map((category) => category),
        tmdb_id: movie.tmdb_id,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        revenue: movie.revenue,
        runtime: movie.runtime,
        status: movie.status,
        tagline: movie.tagline,
        title: movie.title,
        video: movie.video,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genres.map((genre) => ({ tmdb_id: genre.id })),
        },
      },
    });

    await generatePersonCredit(movie.credits, movie.tmdb_id);
  }

  // second, upsert credits (cast, crew)

  console.log('Movies generated');
  console.log('------------------------------');
};
