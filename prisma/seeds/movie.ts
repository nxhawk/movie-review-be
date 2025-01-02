import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

export const generateMovie = async () => {
  console.log('Generating movies');

  const jsonData = await readFile('prisma/json/tmdb_db.movies_2.json', 'utf-8')
    .then((json) => JSON.parse(json))
    .catch(() => console.error('Error reading file'));

  for (const movie of jsonData) {
    await prisma.movie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        adult: movie.adult,
        backdropPath: movie.backdrop_path,
        budget: movie.budget,
        categories: movie.categories.map((category) => category),
        tmdb_id: movie.id,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        revenue: movie.revenue,
        runtime: movie.runtime,
        status: movie.status,
        tagline: movie.tagline,
        title: movie.title,
        video: movie.video,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        genres: {
          connect: movie.genres.map((genre) => ({ tmdb_id: genre.id })),
        },
      },
    });
  }

  console.log('Movies generated');
  console.log('------------------------------');
};
