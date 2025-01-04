import { BadRequestException, Injectable } from '@nestjs/common';
import { WATCHLIST_MESSAGES } from 'src/constants/message';
import { PrismaService } from 'src/shared/prisma/prisma.service';

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
    });

    return allWatchList ? allWatchList : [];
  }

  async getWatchListById(userId: string, watchListId: string) {
    const allWatchList = await this.getAllWatchList(userId);
    const watchList = allWatchList.find((watch) => watch.id === watchListId);

    return watchList;
  }

  async createWatchList(userId: string, name: string) {
    const allWatchList = await this.getAllWatchList(userId);
    const existingWatchList = allWatchList.find((watch) => watch.name === name);

    if (existingWatchList) {
      throw new BadRequestException('Watch list already exists');
    }

    const watchList = await this.prisma.watchList.create({
      data: {
        userId,
        name,
      },
    });

    return {
      message: WATCHLIST_MESSAGES.CREATE_WATCHLIST_SUCCESSFULLY,
      data: watchList,
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
