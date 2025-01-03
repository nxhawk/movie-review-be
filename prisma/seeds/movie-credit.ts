import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateMovieCredit = async (credit, personId) => {
  console.log('Generating movie credits');

  if (!credit) return;

  // upsert cast, crew
  if (credit?.cast?.length > 0) {
    for (const cast of credit.cast) {
      await prisma.movieCast.upsert({
        where: { tmdb_id: cast.id },
        update: {},
        create: {
          tmdb_id: cast.id,
          adult: cast.adult,
          backdropPath: cast.backdrop_path,
          originalLanguage: cast.original_language,
          originalTitle: cast.original_title,
          overview: cast.overview,
          popularity: cast.popularity,
          profilePath: cast.profile_path,
          releaseDate: cast.release_date,
          title: cast.title,
          video: cast.video,
          voteAverage: cast.vote_average,
          voteCount: cast.vote_count,
          character: cast.character,
          credit_id: cast.credit_id,
          order: cast.order,
        },
      });
    }
  }

  if (credit?.crew?.length > 0) {
    for (const crew of credit.crew) {
      await prisma.movieCrew.upsert({
        where: { tmdb_id: crew.id },
        update: {},
        create: {
          tmdb_id: crew.id,
          adult: crew.adult,
          backdropPath: crew.backdrop_path,
          originalLanguage: crew.original_language,
          originalTitle: crew.original_title,
          overview: crew.overview,
          popularity: crew.popularity,
          profilePath: crew.profile_path,
          releaseDate: crew.release_date,
          title: crew.title,
          video: crew.video,
          voteAverage: crew.vote_average,
          voteCount: crew.vote_count,
          credit_id: crew.credit_id,
          department: crew.department,
          job: crew.job,
        },
      });
    }
  }

  await prisma.movieCredit.upsert({
    where: { tmdb_id: personId },
    update: {},
    create: {
      tmdb_id: personId,
      person: {
        connect: { tmdb_id: personId },
      },
      casts: {
        connect: credit?.cast?.map((cast) => ({ tmdb_id: cast.id })),
      },
      crews: {
        connect: credit?.crew?.map((crew) => ({ tmdb_id: crew.id })),
      },
    },
  });

  console.log('Movie credits generated');
  console.log('------------------------------');
};
