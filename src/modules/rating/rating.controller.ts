import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { RatingService } from './rating.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ROUTES } from 'src/constants/route';
import { IUserRequest } from 'src/interfaces';
import { RatingDto } from './dtos/rating.dto';

@ApiTags('Rating movie')
@ApiBearerAuth()
@Controller(ROUTES.RATING)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  @ApiOperation({ summary: 'Get the user’s rated movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the rated movies.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  getRatedMovies(@Req() req: IUserRequest) {
    return this.ratingService.getRatedMovies(req.user.id);
  }

  @Get('/average')
  @ApiOperation({ summary: 'Get the average rating of all movies' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the average rating.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  getAverageRating(@Req() req: IUserRequest) {
    return this.ratingService.getAverageRating(req.user.id);
  }

  @Post('/:movieId')
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'the movie ID to rate',
  })
  @ApiResponse({
    status: 201,
    description: 'Movie successfully rated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  ratingMovie(
    @Req() req: IUserRequest,
    @Param() { movieId },
    @Body() ratingDto: RatingDto,
  ) {
    return this.ratingService.updateRatingMovie(
      req.user.id,
      movieId,
      ratingDto,
    );
  }

  @Get('/:movieId')
  @ApiOperation({ summary: 'Get a movie rating' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to get',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie rating successfully retrieved.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  getRatingMovie(@Req() req: IUserRequest, @Param() { movieId }) {
    return this.ratingService.getRatingMovie(req.user.id, movieId);
  }
}
