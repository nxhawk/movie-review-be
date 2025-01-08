import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

export const generateNowPlayingMovies = async () => {
  console.log('Generating now playing movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_now_playing.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.nowPlayingMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Now playing movies generated');
  console.log('------------------------------');
};

export const generatePopularMovies = async () => {
  console.log('Generating popular movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_popular.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.popularMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Popular movies generated');
  console.log('------------------------------');
};

export const generateTopRatedMovies = async () => {
  console.log('Generating top rated movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_top_rated.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.topRatedMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Top rated movies generated');
  console.log('------------------------------');
};

export const generateUpcomingMovies = async () => {
  console.log('Generating upcoming movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_upcoming.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.upcomingMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Upcoming movies generated');
  console.log('------------------------------');
};

export const generateTrendingDayMovies = async () => {
  console.log('Generating trending day movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_trending_day.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.trendingDayMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        media_type: movie.media_type,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Trending day movies generated');
  console.log('------------------------------');
};

export const generateTrendingWeekMovies = async () => {
  console.log('Generating trending week movies');

  const jsonData = await readFile(
    'prisma/json/tmdb_db.movies_trending_week.json',
    'utf-8',
  )
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const movie of jsonData) {
    await prisma.trendingWeekMovie.upsert({
      where: { tmdb_id: movie.tmdb_id },
      update: {},
      create: {
        tmdb_id: movie.tmdb_id,
        media_type: movie.media_type,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        video: movie.video,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: {
          connect: movie.genre_ids?.map((genre) => ({ tmdb_id: genre })),
        },
      },
    });
  }

  console.log('Trending week movies generated');
  console.log('------------------------------');
};
