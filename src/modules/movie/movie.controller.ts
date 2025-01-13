import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROUTES } from 'src/constants/route';

@ApiTags('Movie TMDB')
@Controller(ROUTES.MOVIE)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/genre')
  @ApiOperation({ summary: 'Get the list of movie genres' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of movie genres.',
  })
  getMovieGenres() {
    return this.movieService.getMovieGenres();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search for movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the search results.',
  })
  searchMovies(@Query() query) {
    return this.movieService.searchMovies(query);
  }

  @Get('/trending-day')
  @ApiOperation({ summary: 'Get the trending movies of the day' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the trending movies of the day.',
  })
  getTrendingMoviesOfDay(@Query() query) {
    return this.movieService.getTrendingMoviesOfDay(query);
  }

  @Get('/trending-week')
  @ApiOperation({ summary: 'Get the trending movies of the week' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the trending movies of the week.',
  })
  getTrendingMoviesOfWeek(@Query() query) {
    return this.movieService.getTrendingMoviesOfWeek(query);
  }

  @Get('/top_rated')
  @ApiOperation({ summary: 'Get the top rated movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the top rated movies.',
  })
  getTopRatedMovies(@Query() query) {
    return this.movieService.getTopRatedMovies(query);
  }

  @Get('/popular')
  @ApiOperation({ summary: 'Get the popular movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the popular movies.',
  })
  getPopularMovies(@Query() query) {
    return this.movieService.getPopularMovies(query);
  }

  @Get('/now_playing')
  @ApiOperation({ summary: 'Get the now playing movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the now playing movies.',
  })
  getNowPlayingMovies(@Query() query) {
    return this.movieService.getNowPlayingMovies(query);
  }

  @Get('/upcoming')
  @ApiOperation({ summary: 'Get the upcoming movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the upcoming movies.',
  })
  getUpcomingMovies(@Query() query) {
    return this.movieService.getUpcomingMovies(query);
  }
  @Get('/release-date-range')
  @ApiOperation({
    summary: 'Get movies released 3 months from now or 1 months before',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved the movies within the specified date range.',
  })
  getMoviesByReleaseDateRange() {
    return this.movieService.getMoviesByReleaseDateRange();
  }
  @Get('/now-playing-trailers')
  @ApiOperation({ summary: 'Get trailers for now playing movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the now playing movie trailers.',
  })
  getNowPlayingMovieTrailers() {
    return this.movieService.getNowPlayingMovieTrailers();
  }
  @Get('/advanced-search')
  @ApiOperation({ summary: 'Advanced search for movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the search results.',
  })
  advancedSearchMovies(@Query() query) {
    return this.movieService.advancedSearchMovies(query);
  }

  @Get('/:movieId')
  @ApiOperation({ summary: 'Get the detail of a movie' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to get detail',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie detail.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  getMovieDetail(@Param() { movieId }) {
    return this.movieService.getMovieDetail(movieId);
  }

  @Get('/:movieId/videos')
  @ApiOperation({ summary: 'Get the videos of a movie' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to get videos',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie videos.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  getMovieVideos(@Param() { movieId }) {
    return this.movieService.getMovieVideos(movieId);
  }

  @Get('/:movieId/reviews')
  @ApiOperation({ summary: 'Get the reviews of a movie' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to get reviews',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie reviews.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  getMovieReviews(@Param() { movieId }) {
    return this.movieService.getMovieReviews(movieId);
  }

  @Get('/:movieId/credits')
  @ApiOperation({ summary: 'Get the credits of a movie' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to get credits',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie credits.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  getMovieCredits(@Param() { movieId }) {
    return this.movieService.getMovieCredits(movieId);
  }
}
