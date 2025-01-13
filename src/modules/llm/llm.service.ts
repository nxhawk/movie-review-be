import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieRetrieverDto } from './dtos/movie-retriever.dto';
import { AxiosError } from 'axios';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { catchError, firstValueFrom } from 'rxjs';
import { NavigateDto } from './dtos/navigate.dto';
import { NAVIGATE_ROUTE, NAVIGATE_ROUTE_PAGE } from 'src/constants/navigate';

@Injectable()
export class LlmService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async searchMovieByNaturalLanguage(query) {
    const threshold = Number(query['threshold']) || 0.25;
    const search = query['query'];
    const llm_api_key = this.configService.get('llm.apiKey');
    const collection_name = 'movies';
    const amount = Number(query['amount']) || 20;

    const { data } = await firstValueFrom(
      this.httpService
        .get<MovieRetrieverDto>(
          `/retriever/?llm_api_key=${llm_api_key}&collection_name=${collection_name}&query=${search}&threshold=${threshold}&amount=${amount}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw new BadRequestException('Error searching collection');
          }),
        ),
    );

    const movieIds = data.data.result;
    // get correct movie from database based on id
    const movies = (
      await Promise.all(
        movieIds.map(async (id) => {
          const movie = await this.prisma.movie.findFirst({
            where: { id },
            select: {
              tmdb_id: true,
              title: true,
              poster_path: true,
              release_date: true,
              genres: true,
              vote_average: true,
              overview: true,
            },
          });
          return movie;
        }),
      )
    ).filter((movie) => movie !== null);

    return {
      data: movies,
      message: 'Movies retrieved successfully',
    };
  }

  async getPageNavigation(query) {
    const search = query['query'];
    const llm_api_key = this.configService.get('llm.apiKey');

    const { data } = await firstValueFrom(
      this.httpService
        .post<NavigateDto>(
          `/navigate/?llm_api_key=${llm_api_key}&query=${encodeURIComponent(search)}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw new BadRequestException('Error navigating collection');
          }),
        ),
    );

    if (!data || data.data.route === NAVIGATE_ROUTE.NONE) {
      throw new BadRequestException('No route found');
    }

    const { route, params } = data.data;

    // is the route get list cast
    if (route === NAVIGATE_ROUTE.CAST_PAGE) {
      const movieId = params?.movie_ids?.[0];
      if (!movieId) {
        throw new BadRequestException('No movie id found');
      }

      // get tmdb_id from movie
      const movie = await this.prisma.movie.findFirst({
        where: { id: movieId },
        select: { tmdb_id: true },
      });

      return {
        route: NAVIGATE_ROUTE_PAGE.LIST_CAST_PAGE.replace(
          ':id',
          movie.tmdb_id.toString(),
        ),
      };
    }

    // is home page
    if (route === NAVIGATE_ROUTE.HOME_PAGE) {
      return {
        route: NAVIGATE_ROUTE_PAGE.HOME_PAGE,
      };
    }

    // is profile page
    if (route === NAVIGATE_ROUTE.PROFILE_PAGE) {
      return {
        route: NAVIGATE_ROUTE_PAGE.PROFILE_PAGE,
      };
    }

    // is search page
    if (route === NAVIGATE_ROUTE.SEARCH_PAGE) {
      const keyword = params?.keyword;
      return {
        route: NAVIGATE_ROUTE_PAGE.SEARCH_PAGE + `?query=${keyword}`,
      };
    }

    // is movie page
    if (route === NAVIGATE_ROUTE.MOVIE_PAGE) {
      const movieId = params?.movie_ids?.[0];
      if (!movieId) {
        throw new BadRequestException('No movie id found');
      }

      // get tmdb_id from movie
      const movie = await this.prisma.movie.findFirst({
        where: { id: movieId },
        select: { tmdb_id: true },
      });

      return {
        route: NAVIGATE_ROUTE_PAGE.MOVIE_PAGE.replace(
          ':id',
          movie.tmdb_id.toString(),
        ),
      };
    }

    return data;
  }
}
