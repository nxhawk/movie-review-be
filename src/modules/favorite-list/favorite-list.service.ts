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
    });

    return favorites ? favorites : [];
  }

  async addFavorite(userId: string, movieId: string) {
    const favorite = await this.prisma.favoriteList.findUnique({
      where: {
        userId,
      },
    });

    if (!favorite) {
      await this.prisma.favoriteList.create({
        data: {
          userId,
          movies: [movieId],
        },
      });
    } else {
      if (favorite.movies.includes(movieId)) {
        throw new BadRequestException(
          FAVORITE_MESSAGES.MOVIE_ALREADY_IN_FAVORITE,
        );
      }
      await this.prisma.favoriteList.update({
        where: {
          userId,
        },
        data: {
          movies: [...favorite.movies, movieId],
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
        movies: favorite.movies.filter((id) => id !== movieId),
      },
    });

    return { message: FAVORITE_MESSAGES.DELETE_FAVORITE_SUCCESSFULLY };
  }
}
