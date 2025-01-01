import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { FavoriteListService } from './favorite-list.service';
import { ROUTES } from 'src/constants/route';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUserRequest } from 'src/interfaces';

@ApiTags('Favorite List')
@ApiBearerAuth()
@Controller(ROUTES.FAVORITELIST)
export class FavoriteListController {
  constructor(private readonly favoriteListService: FavoriteListService) {}

  @Get()
  @ApiOperation({ summary: 'Get the user’s favorite movie list' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the favorite list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  getListFavorite(@Req() req: IUserRequest) {
    return this.favoriteListService.getListFavorite(req.user.id);
  }

  @Post('/:movieId')
  @ApiOperation({ summary: 'Add a movie to the user’s favorite list' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to add',
  })
  @ApiResponse({
    status: 201,
    description: 'Movie successfully added to the favorite list.',
  })
  @ApiResponse({
    status: 400,
    description: 'Movie already exists in the favorite list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  addFavorite(@Req() req: IUserRequest, @Param() { movieId }) {
    return this.favoriteListService.addFavorite(req.user.id, movieId);
  }

  @Delete('/:movieId')
  @ApiOperation({ summary: 'Remove a movie from the user’s favorite list' })
  @ApiParam({
    name: 'movieId',
    type: String,
    description: 'The ID of the movie to remove',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully removed from the favorite list.',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found in the favorite list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  removeFavorite(@Req() req: IUserRequest, @Param() { movieId }) {
    return this.favoriteListService.removeFavorite(req.user.id, movieId);
  }
}
