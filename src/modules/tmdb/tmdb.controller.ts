import { Controller, Get, Param, Query } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ROUTES } from '../../constants/route';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MovieDetailsDto } from './dto/movie-details.dto';
import { ListVideoDto } from './dto/video.dto';
import { ListMovieDto } from './dto/movie.dto';

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

  @ApiOkResponse({
    description: 'Retrieve list of videos for the movie',
    type: ListVideoDto,
  })
  @Get('/movie/:movieId/videos')
  async getVideosOfMovie(@Param() { movieId }) {
    return await this.tmdbService.getVideosByMovieId(movieId);
  }

  @ApiOkResponse({
    description:
      'Retrieve the trending movies for the current day, sorted by popularity.',
    type: ListMovieDto,
  })
  @Get('/trending/movie/day')
  async getTodayTrendingMovie() {
    return await this.tmdbService.getTodayTrending();
  }

  @ApiOkResponse({
    description:
      'Retrieve the trending movies for this week, sorted by popularity.',
    type: ListMovieDto,
  })
  @Get('/trending/movie/week')
  async getWeeklyTrendingMovie() {
    return await this.tmdbService.getWeeklyTrending();
  }

  @ApiOkResponse({
    description:
      'Retrieve movies matching the search query. Results include detailed movie information, sorted by relevance.',
    type: ListMovieDto,
  })
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'The search keyword to find movies.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'The page number for paginated results. Defaults to 1.',
  })
  @Get('/search/movie')
  async getMovieByQuery(@Query() query) {
    return await this.tmdbService.getMovieByQuery(query);
  }
}
