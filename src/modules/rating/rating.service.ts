import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RatingDto } from './dtos/rating.dto';
import { isNumber } from 'class-validator';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async getRatedMovies(userId: string) {
    return this.prisma.rating.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        rating: true,
        mood: true,
        movie: {
          select: {
            id: true,
            tmdb_id: true,
            title: true,
            poster_path: true,
            backdrop_path: true,
            release_date: true,
            vote_average: true,
          },
        },
      },
    });
  }

  async getAverageRating(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        userId,
      },
      select: {
        rating: true,
      },
    });

    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);

    return {
      averageRating: Math.round(averageRating / ratings.length),
    };
  }

  async updateRatingMovie(
    userId: string,
    movieId: string,
    ratingDto: RatingDto,
  ) {
    const { rating, mood } = ratingDto;

    const range = [5, 5, 3, 5, 3, 3, 3];
    mood.map((moodValue, index) => {
      if (!isNumber(moodValue))
        throw new BadRequestException(`Mood ${index} must be a number`);
      if (moodValue < -1 || moodValue > range[index])
        throw new BadRequestException(
          `Mood ${index} must be between 0 and ${range[index]}`,
        );
    });

    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId,
        movie: { tmdb_id: parseInt(movieId) },
      },
    });

    if (existingRating) {
      return this.prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          rating,
          mood,
        },
      });
    }
    return this.prisma.rating.create({
      data: {
        rating,
        mood,
        movie: {
          connect: { tmdb_id: parseInt(movieId) },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async getRatingMovie(userId: string, movieId: string) {
    const rating = await this.prisma.rating.findFirst({
      where: {
        userId,
        movie: { tmdb_id: parseInt(movieId) },
      },
    });

    return rating ? rating : { rating: 0, mood: [-1, -1, -1, -1, -1, -1, -1] };
  }
}
