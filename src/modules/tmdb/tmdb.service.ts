import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { TMDB_MESSAGES } from '../../constants/message';
import { MovieDetailsDto } from './dto/movie-details.dto';
import { ErrorResourceDto } from './dto/error-resource.dto';
import { ListVideoDto } from './dto/video.dto';

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
}
