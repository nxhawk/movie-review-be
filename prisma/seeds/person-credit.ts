import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generatePersonCredit = async (credit, movieId) => {
  console.log('Generating person credits');

  if (!credit) return;

  // upsert cast, crew
  if (credit?.cast?.length > 0) {
    for (const cast of credit.cast) {
      await prisma.cast.upsert({
        where: { tmdb_id: cast.id },
        update: {},
        create: {
          tmdb_id: cast.id,
          adult: cast.adult,
          gender: cast.gender,
          knownForDepartment: cast.known_for_department,
          name: cast.name,
          originalName: cast.original_name,
          popularity: cast.popularity,
          profilePath: cast.profile_path,
          credit_id: cast.credit_id,
          cast_id: cast.cast_id,
          character: cast.character,
          order: cast.order,
        },
      });
    }
  }

  if (credit?.crew?.length > 0) {
    for (const crew of credit.crew) {
      await prisma.crew.upsert({
        where: { tmdb_id: crew.id },
        update: {},
        create: {
          tmdb_id: crew.id,
          adult: crew.adult,
          gender: crew.gender,
          knownForDepartment: crew.known_for_department,
          name: crew.name,
          originalName: crew.original_name,
          popularity: crew.popularity,
          profilePath: crew.profile_path,
          credit_id: crew.credit_id,
          department: crew.department,
          job: crew.job,
        },
      });
    }
  }

  await prisma.credit.upsert({
    where: { tmdb_id: movieId },
    update: {},
    create: {
      tmdb_id: movieId,
      movie: {
        connect: { tmdb_id: movieId },
      },
      casts: {
        connect: credit?.cast?.map((cast) => ({ tmdb_id: cast.id })),
      },
      crews: {
        connect: credit?.crew?.map((crew) => ({ tmdb_id: crew.id })),
      },
    },
  });

  console.log('Person credits generated');
  console.log('------------------------------');
};
