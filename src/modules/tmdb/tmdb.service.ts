import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { TMDB_MESSAGES } from '../../constants/message';
import { MovieDetailsDto } from './dto/movie-details.dto';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getMovieById(movieId: string): Promise<MovieDetailsDto[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          MovieDetailsDto[]
        >(`${this.config.getOrThrow('tmdb.endpoint')}/movie/${movieId}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new NotFoundException(TMDB_MESSAGES.INVALID_ID);
          }),
        ),
    );

    return data;
  }
}
