import { Controller, Get, Param } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ROUTES } from '../../constants/route';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MovieDetailsDto } from './dto/movie-details.dto';

@ApiTags('The Movie DB')
@Controller(ROUTES.TMDB)
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @ApiOkResponse({
    description: 'Retrieve movie details',
    type: MovieDetailsDto,
  })
  @Get('/movie/:movieId')
  async getMovieDetails(@Param() { movieId }) {
    return await this.tmdbService.getMovieById(movieId);
  }
}
