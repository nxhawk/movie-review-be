import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateGenre = async (API_KEY: string) => {
  console.log('Generating genres');

  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  await fetch(url, options)
    .then((res) => res.json())
    .then(async (json) => {
      for (const genre of json.genres) {
        await prisma.genre.upsert({
          where: { tmdb_id: genre.id },
          update: {},
          create: {
            tmdb_id: genre.id,
            name: genre.name,
          },
        });
      }
    })
    .catch((err) => console.error(err));

  console.log('Genres generated');
  console.log('------------------------------');
};