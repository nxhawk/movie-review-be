import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { TMDB_MESSAGES } from '../../constants/message';
import { MovieDetailsDto } from './dto/movie-details.dto';
import { ErrorResourceDto } from './dto/error-resource.dto';
import { ListVideoDto } from './dto/video.dto';
import { ListMovieDto } from './dto/movie.dto';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  constructor(private readonly httpService: HttpService) {}

  async getMovieById(movieId: string): Promise<MovieDetailsDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<MovieDetailsDto[]>(`/movie/${movieId}`).pipe(
        catchError((error: AxiosError) => {
          const err = error.response.data as ErrorResourceDto;
          throw new NotFoundException(
            err.status_message || TMDB_MESSAGES.INVALID_ID,
          );
        }),
      ),
    );

    return data;
  }

  async getVideosByMovieId(movieId: string): Promise<ListVideoDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<ListVideoDto>(`/movie/${movieId}/videos`).pipe(
        catchError((error: AxiosError) => {
          const err = error.response.data as ErrorResourceDto;
          throw new NotFoundException(
            err.status_message || TMDB_MESSAGES.INVALID_ID,
          );
        }),
      ),
    );

    return data;
  }

  async getTodayTrending(): Promise<ListMovieDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ListMovieDto>(`/trending/movie/day?language=en-US`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async getWeeklyTrending(): Promise<ListMovieDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ListMovieDto>(`/trending/movie/week?language=en-US`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async getMovieByQuery(query): Promise<ListMovieDto> {
    const page = Number(query['page']) || 1;
    const search = query['query'] || '';

    const { data } = await firstValueFrom(
      this.httpService
        .get<ListMovieDto>(`/search/movie?query=${search}&page=${page}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }
}
