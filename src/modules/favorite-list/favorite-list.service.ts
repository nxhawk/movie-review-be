import { BadRequestException, Injectable } from '@nestjs/common';
import { FAVORITE_MESSAGES } from 'src/constants/message';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class FavoriteListService {
  constructor(private prisma: PrismaService) {}

  async getListFavorite(userId: string) {
    const favorites = await this.prisma.favoriteList.findUnique({
      where: {
        userId,
      },
      include: {
        movies: true,
      },
    });

    return favorites
      ? { ...favorites, movies: favorites.movies.reverse() }
      : [];
  }

  async checkFavorite(userId: string, movieId: string) {
    const favorite = await this.prisma.favoriteList.findUnique({
      where: {
        userId,
      },
      include: {
        movies: true,
      },
    });

    if (!favorite) {
      return false;
    }

    if (favorite.movies.find((movie) => movie.tmdb_id === parseInt(movieId))) {
      return true;
    }

    return false;
  }

  async addFavorite(userId: string, movieId: string) {
    const favorite = await this.prisma.favoriteList.findUnique({
      where: {
        userId,
      },
      include: {
        movies: true,
      },
    });

    if (!favorite) {
      await this.prisma.favoriteList.create({
        data: {
          userId,
          movies: {
            connect: { tmdb_id: parseInt(movieId) },
          },
        },
      });
    } else {
      if (
        favorite.movies.find((movie) => movie.tmdb_id === parseInt(movieId))
      ) {
        throw new BadRequestException(
          FAVORITE_MESSAGES.MOVIE_ALREADY_IN_FAVORITE,
        );
      }
      await this.prisma.favoriteList.update({
        where: {
          userId,
        },
        data: {
          movies: {
            connect: { tmdb_id: parseInt(movieId) },
          },
        },
      });
    }

    return { message: FAVORITE_MESSAGES.ADD_FAVORITE_SUCCESSFULLY };
  }

  async removeFavorite(userId: string, movieId: string) {
    const favorite = await this.prisma.favoriteList.findUnique({
      where: {
        userId,
      },
    });

    if (!favorite) {
      return { message: FAVORITE_MESSAGES.DELETE_FAVORITE_SUCCESSFULLY };
    }

    await this.prisma.favoriteList.update({
      where: {
        userId,
      },
      data: {
        movies: {
          disconnect: { tmdb_id: parseInt(movieId) },
        },
      },
    });

    return { message: FAVORITE_MESSAGES.DELETE_FAVORITE_SUCCESSFULLY };
  }
}
