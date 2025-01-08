import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { generateMovieCredit } from './movie-credit';

const prisma = new PrismaClient();

export const generatePeople = async () => {
  console.log('Generating people');

  const jsonData = await readFile('prisma/json/tmdb_db.people.json', 'utf-8')
    .then((json) => JSON.parse(json))
    .catch((e) => {
      throw new Error(e.message);
    });

  for (const person of jsonData) {
    // first, upsert person
    await prisma.person.upsert({
      where: { tmdb_id: person.tmdb_id },
      update: {},
      create: {
        tmdb_id: person.tmdb_id,
        adult: person.adult,
        also_known_as: person.also_known_as.map((name) => name),
        biography: person.biography,
        birthday: person?.birthday,
        deathday: person?.deathday,
        gender: person.gender,
        known_for_department: person.known_for_department,
        name: person.name,
        place_of_birth: person.place_of_birth,
        popularity: person.popularity,
        profile_path: person.profile_path,
      },
    });

    // second, upsert credits (cast, crew)
    await generateMovieCredit(person.movie_credits, person.tmdb_id);
  }

  console.log('People generated');
  console.log('------------------------------');
};
