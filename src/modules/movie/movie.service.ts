import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { addMonths, subMonths } from 'date-fns';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async getMovieGenres() {
    return {
      genres: await this.prisma.genre.findMany(),
    };
  }

  async searchMovies(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;
    const searchQuery = query['query'];

    if (!searchQuery)
      return {
        page,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

    const movies = await this.prisma.movie.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        adult: true,
        original_language: true,
        original_title: true,
        overview: true,
        popularity: true,
        tmdb_id: true,
        title: true,
        poster_path: true,
        backdrop_path: true,
        release_date: true,
        vote_average: true,
        vote_count: true,
        genres: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.movie.count({
          where: {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        })) / perPage,
      ),
      total_results: await this.prisma.movie.count({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      }),
    };
  }

  // async getMovieDetail(movieId: string) {
  //   try {
  //     const movie = await this.prisma.movie.findUnique({
  //       where: { tmdb_id: parseInt(movieId) },
  //     });
  //     if (!movie) throw new BadRequestException('Movie not found.');
  //     return _.omit(movie, [
  //       'watchListIDs',
  //       'favoriteListIDs',
  //       'historyIDs',
  //       'trailers',
  //       'reviews',
  //       'credits',
  //     ]);
  //   } catch (error) {
  //     throw new BadRequestException('Movie not found.');
  //   }
  // }

  async getTrendingMoviesOfDay(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.trendingDayMovie.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.trendingDayMovie.count()) / perPage,
      ),
      total_results: await this.prisma.trendingDayMovie.count(),
    };
  }

  async getTrendingMoviesOfWeek(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.trendingWeekMovie.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.trendingWeekMovie.count()) / perPage,
      ),
      total_results: await this.prisma.trendingWeekMovie.count(),
    };
  }

  async getTopRatedMovies(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.topRatedMovie.findMany({
      orderBy: {
        vote_average: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.topRatedMovie.count()) / perPage,
      ),
      total_results: await this.prisma.topRatedMovie.count(),
    };
  }

  async getPopularMovies(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.popularMovie.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.popularMovie.count()) / perPage,
      ),
      total_results: await this.prisma.popularMovie.count(),
    };
  }

  async getNowPlayingMovies(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.nowPlayingMovie.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.nowPlayingMovie.count()) / perPage,
      ),
      total_results: await this.prisma.nowPlayingMovie.count(),
    };
  }

  async getUpcomingMovies(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const movies = await this.prisma.upcomingMovie.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: movies,
      total_pages: Math.ceil(
        (await this.prisma.upcomingMovie.count()) / perPage,
      ),
      total_results: await this.prisma.upcomingMovie.count(),
    };
  }

  async getMovieVideos(movieId: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { tmdb_id: parseInt(movieId) },
        select: {
          trailers: true,
          tmdb_id: true,
        },
      });
      return {
        id: movie.tmdb_id,
        results: movie.trailers,
      };
    } catch (error) {
      throw new BadRequestException('Movie not found.');
    }
  }

  async getMovieReviews(movieId: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { tmdb_id: parseInt(movieId) },
        select: {
          reviews: true,
          tmdb_id: true,
        },
      });
      return {
        id: movie.tmdb_id,
        results: movie.reviews,
        total_results: movie.reviews.length || 0,
      };
    } catch (error) {
      throw new BadRequestException('Movie not found.');
    }
  }

  async getMovieCredits(movieId: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { tmdb_id: parseInt(movieId) },
        select: {
          tmdb_id: true,
          credits: true,
        },
      });
      return {
        id: movie.tmdb_id,
        cast: movie.credits.cast,
        crew: movie.credits.crew,
      };
    } catch (error) {
      throw new BadRequestException('Movie not found.');
    }
  }

  async getMoviesByReleaseDateRange() {
    try {
      const sixMonthsFromNow = addMonths(new Date(), 3);
      const twoMonthsBefore = subMonths(new Date(), 1);

      return await this.prisma.movie.findMany({
        where: {
          OR: [
            {
              release_date: {
                gte: twoMonthsBefore.toISOString(),
                lte: new Date().toISOString(),
              },
            },
            {
              release_date: {
                gte: new Date().toISOString(),
                lte: sixMonthsFromNow.toISOString(),
              },
            },
          ],
        },
        orderBy: {
          popularity: 'desc',
        },
        take: 15,
        select: {
          id: true,
          tmdb_id: true,
          backdrop_path: true,
          release_date: true,
          title: true,
          original_title: true,
          trailers: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve movies.');
    }
  }
  async getNowPlayingMovieTrailers() {
    try {
      const movies = await this.prisma.nowPlayingMovie.findMany({
        take: 15,
        select: {
          id: true,
          tmdb_id: true,
          backdrop_path: true,
          release_date: true,
          title: true,
          original_title: true,
        },
      });

      return await Promise.all(
        movies.map(async (movie) => {
          const trailers = await this.prisma.movie.findUnique({
            where: { tmdb_id: movie.tmdb_id },
            select: { trailers: true },
          });
          return { ...movie, trailers: trailers?.trailers || [] };
        }),
      );
    } catch (error) {
      throw new BadRequestException('Failed to retrieve now playing movies.');
    }
  }
}
