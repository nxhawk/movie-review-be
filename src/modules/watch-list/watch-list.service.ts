import { BadRequestException, Injectable } from '@nestjs/common';
import { WATCHLIST_MESSAGES } from 'src/constants/message';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateWatchListDto } from './dtos/create-watchlist.dto';

@Injectable()
export class WatchListService {
  constructor(private prisma: PrismaService) {}

  async getAllWatchList(userId: string) {
    const allWatchList = await this.prisma.watchList.findMany({
      where: {
        userId,
      },
      include: {
        movies: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return allWatchList ? allWatchList : [];
  }

  async getWatchListByAnyId(watchListId: string) {
    const watchList = await this.prisma.watchList.findFirst({
      where: {
        id: watchListId,
      },
      include: {
        movies: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { ...watchList, movies: watchList.movies.reverse() };
  }

  async getWatchListById(userId: string, watchListId: string) {
    const watchList = await this.prisma.watchList.findFirst({
      where: {
        id: watchListId,
        userId,
      },
      include: {
        movies: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return watchList;
  }

  async createWatchList(
    userId: string,
    createWatchListDto: CreateWatchListDto,
  ) {
    const { name } = createWatchListDto;
    const allWatchList = await this.getAllWatchList(userId);
    const existingWatchList = allWatchList.find((watch) => watch.name === name);

    if (existingWatchList) {
      throw new BadRequestException('Watch list with this name already exists');
    }

    const watchList = await this.prisma.watchList.create({
      data: {
        userId,
        ...createWatchListDto,
      },
    });

    return {
      message: WATCHLIST_MESSAGES.CREATE_WATCHLIST_SUCCESSFULLY,
      data: watchList,
    };
  }

  async updateWatchList(
    userId: string,
    watchListId: string,
    createWatchListDto: CreateWatchListDto,
  ) {
    const watchList = await this.getWatchListById(userId, watchListId);

    if (!watchList) {
      throw new BadRequestException('Watch list does not exist');
    }

    const updatedWatchList = await this.prisma.watchList.update({
      where: {
        id: watchListId,
      },
      data: {
        ...createWatchListDto,
      },
    });

    return {
      message: WATCHLIST_MESSAGES.UPDATE_WATCHLIST_SUCCESSFULLY,
      data: updatedWatchList,
    };
  }

  async addToWatchList(userId: string, watchListId: string, movieId: string) {
    const watchList = await this.getWatchListById(userId, watchListId);

    if (!watchList) {
      throw new BadRequestException('Watch list does not exist');
    }

    const existingMovie = watchList.movies.find(
      (movie) => movie.tmdb_id === parseInt(movieId),
    );
    if (existingMovie) {
      throw new BadRequestException('Movie already exists in the watch list');
    }

    const updatedWatchList = await this.prisma.watchList.update({
      where: {
        id: watchListId,
      },
      data: {
        movies: {
          connect: { tmdb_id: parseInt(movieId) },
        },
      },
    });

    return {
      message: WATCHLIST_MESSAGES.ADD_WATCHLIST_SUCCESSFULLY,
      data: updatedWatchList,
    };
  }

  async removeFromWatchList(
    userId: string,
    watchListId: string,
    movieId: string,
  ) {
    const watchList = await this.getWatchListById(userId, watchListId);

    if (!watchList) {
      throw new BadRequestException('Watch list does not exist');
    }

    const updatedWatchList = await this.prisma.watchList.update({
      where: {
        id: watchListId,
      },
      data: {
        movies: {
          disconnect: { tmdb_id: parseInt(movieId) },
        },
      },
    });

    return {
      message: WATCHLIST_MESSAGES.REMOVE_MOVIE_FROM_WATCHLIST_SUCCESSFULLY,
      data: updatedWatchList,
    };
  }

  async deleteWatchList(userId: string, watchListId: string) {
    const watchList = await this.getWatchListById(userId, watchListId);

    if (!watchList) {
      throw new BadRequestException('Watch list does not exist');
    }

    await this.prisma.watchList.delete({
      where: {
        id: watchListId,
      },
    });

    return { message: WATCHLIST_MESSAGES.DELETE_WATCHLIST_SUCCESSFULLY };
  }
}
