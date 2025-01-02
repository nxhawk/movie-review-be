import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { ROUTES } from 'src/constants/route';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUserRequest } from 'src/interfaces';
import { CreateWatchListDto } from './dtos/create-watchlist.dto';
import { AddToWishlistDto } from './dtos/add-to-watchlist.dto';

@ApiTags('Watch List')
@ApiBearerAuth()
@Controller(ROUTES.WATCHLIST)
export class WatchListController {
  constructor(private readonly watchListService: WatchListService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the user’s complete watch list' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the watch list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  getAllUserWatchList(@Req() req: IUserRequest) {
    return this.watchListService.getAllWatchList(req.user.id);
  }

  @Get('/:watchListId')
  @ApiOperation({ summary: 'Retrieve a specific watch list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the watch list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Watch list not found.' })
  getWatchListById(@Req() req: IUserRequest, @Param() { watchListId }) {
    return this.watchListService.getWatchListById(req.user.id, watchListId);
  }

  @Post('/new')
  @ApiOperation({ summary: 'Create a new watch list for the user' })
  @ApiResponse({
    status: 201,
    description: 'Watch list successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiBody({ type: CreateWatchListDto })
  createWatchList(
    @Req() req: IUserRequest,
    @Body() createWatchListDto: CreateWatchListDto,
  ) {
    return this.watchListService.createWatchList(
      req.user.id,
      createWatchListDto.name,
    );
  }

  @Post('/add')
  @ApiOperation({ summary: 'Add a movie to a specific watch list' })
  @ApiResponse({
    status: 201,
    description: 'Movie successfully added to the watch list.',
  })
  @ApiResponse({
    status: 400,
    description: 'Movie already exists in the watch list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Watch list not found.' })
  @ApiBody({ type: AddToWishlistDto })
  addMovieToWatchList(
    @Req() req: IUserRequest,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    return this.watchListService.addToWatchList(
      req.user.id,
      addToWishlistDto.watchListId,
      addToWishlistDto.movieId,
    );
  }

  @Delete('/remove')
  @ApiOperation({ summary: 'Remove a movie from a specific watch list' })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully removed from the watch list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Watch list not found.' })
  @ApiBody({ type: AddToWishlistDto })
  removeMovieFromWatchList(
    @Req() req: IUserRequest,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    return this.watchListService.removeFromWatchList(
      req.user.id,
      addToWishlistDto.watchListId,
      addToWishlistDto.movieId,
    );
  }

  @Delete('/:watchListId')
  @ApiOperation({ summary: 'Delete a specific watch list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Watch list successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Watch list not found.' })
  deleteWatchList(@Req() req: IUserRequest, @Param() { watchListId }) {
    return this.watchListService.deleteWatchList(req.user.id, watchListId);
  }
}
