import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { addMonths, subMonths } from 'date-fns';
import _ from 'lodash';
import { Prisma } from '@prisma/client';

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

  async getMovieDetail(movieId: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { tmdb_id: parseInt(movieId) },
      });
      if (!movie) throw new BadRequestException('Movie not found.');
      return _.omit(movie, [
        'watchListIDs',
        'favoriteListIDs',
        'historyIDs',
        'trailers',
        'reviews',
        'credits',
      ]);
    } catch (error) {
      throw new BadRequestException('Movie not found.');
    }
  }

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

  async getMovieRecommendationsByGenres(movieId: string) {
    // lay danh sach the loai phim
    const limit = 20;
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { tmdb_id: parseInt(movieId) },
        select: { genres: true, tmdb_id: true },
      });

      const count = movie.genres.length < 3 ? movie.genres.length : 3;

      // lay danh sach popular movie co genres trùng với movie >= count
      const allMovies = await this.prisma.popularMovie.findMany({
        where: {
          AND: [
            {
              tmdb_id: {
                not: movie.tmdb_id,
              },
            },
            {
              genre_ids: {
                hasSome: movie.genres.map((genre) => genre['id']),
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          tmdb_id: true,
          original_title: true,
          backdrop_path: true,
          poster_path: true,
          release_date: true,
          vote_average: true,
          genre_ids: true,
        },
      });

      if (allMovies.length <= limit)
        return {
          data: allMovies,
        };

      // Lọc các phim có số lượng genres trùng khớp >= count
      const filteredMovies = allMovies.filter((popularMovie) => {
        const matchingGenres = popularMovie.genre_ids.filter((id) =>
          movie.genres.map((g) => g['id']).includes(id),
        );
        return matchingGenres.length >= count;
      });

      // Trả về tối đa 20 phim
      return {
        data: filteredMovies.slice(0, limit),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Movie not found.');
    }
  }

  async advancedSearchMovies(query) {
    const sort_by = query['sort_by'] || 'popularity.desc';
    const vote_average_gte = Number(query['vote_average.gte']);
    const vote_average_lte = Number(query['vote_average.lte']) || 10;
    const with_genres = query['with_genres'] || '';
    const release_date_gte = query['release_date.gte'] || '';
    const release_date_lte = query['release_date.lte'] || '';
    const searchQuery = query['query'] || '';
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;

    const [sortField, sortOrder] = sort_by.split('.');
    const validSortOrder = ['asc', 'desc'].includes(sortOrder)
      ? sortOrder
      : 'desc';
    const validSortField = [
      'popularity',
      'vote_average',
      'release_date',
    ].includes(sortField)
      ? sortField
      : 'popularity';

    const voteAverageGte = vote_average_gte
      ? Number(vote_average_gte)
      : undefined;
    const voteAverageLte = vote_average_lte
      ? Number(vote_average_lte)
      : undefined;
    const genreIds = with_genres ? with_genres.split(',').map(Number) : [];
    const releaseDateGte = release_date_gte
      ? new Date(release_date_gte).toISOString()
      : undefined;
    const releaseDateLte = release_date_lte
      ? new Date(release_date_lte).toISOString()
      : undefined;

    const filters: Prisma.MovieWhereInput = {
      AND: [
        searchQuery
          ? {
              title: {
                contains: searchQuery,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            }
          : undefined,
        voteAverageGte || voteAverageLte
          ? {
              vote_average: {
                gte: voteAverageGte,
                lte: voteAverageLte,
              },
            }
          : undefined,
        releaseDateGte || releaseDateLte
          ? {
              release_date: {
                gte: releaseDateGte || undefined,
                lte: releaseDateLte || undefined,
              },
            }
          : undefined,
      ].filter(Boolean),
    };

    // Fetch more results than needed
    const extraResults = perPage * (genreIds.length > 0 ? 3 : 1);

    const movies = await this.prisma.movie.findMany({
      where: filters,
      orderBy: {
        [validSortField]: validSortOrder,
      },
      skip: (page - 1) * extraResults,
      take: extraResults,
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
    });

    // Manually filter movies based on genres
    const filteredMovies =
      genreIds.length > 0
        ? movies.filter((movie) =>
            movie.genres.some((genre) => genreIds.includes(genre['id'])),
          )
        : movies;

    // Slice the filtered results to match the perPage value
    const paginatedMovies = filteredMovies.slice(0, perPage);

    const totalResults = await this.prisma.movie.count({ where: filters })/3;
    const totalPages = Math.ceil(totalResults / perPage);

    return {
      page,
      results: paginatedMovies,
      total_pages: totalPages,
      total_results: totalResults,
    };
  }
}
