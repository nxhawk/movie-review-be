import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import _ from 'lodash';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async searchPeople(query) {
    const page = Number(query['page']) || 1;
    const perPage = Number(query['perPage']) || 20;
    const searchQuery = query['query'];

    if (!searchQuery)
      return {
        page,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

    const people = await this.prisma.person.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        adult: true,
        also_known_as: true,
        birthday: true,
        deathday: true,
        gender: true,
        tmdb_id: true,
        known_for_department: true,
        name: true,
        place_of_birth: true,
        popularity: true,
        profile_path: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      page,
      results: people,
      total_pages: Math.ceil(
        (await this.prisma.person.count({
          where: {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        })) / perPage,
      ),
      total_results: await this.prisma.person.count({
        where: {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      }),
    };
  }

  async getPersonDetail(personId: string) {
    try {
      const person = await this.prisma.person.findUnique({
        where: {
          tmdb_id: Number(personId),
        },
      });
      if (!person) throw new BadRequestException('Person not found.');
      return _.omit(person, ['movie_credits']);
    } catch (error) {
      throw new BadRequestException('Person not found.');
    }
  }

  async getPersonCredits(personId: string) {
    try {
      const person = await this.prisma.person.findUnique({
        where: {
          tmdb_id: Number(personId),
        },
        select: {
          movie_credits: true,
        },
      });
      return person.movie_credits;
    } catch (error) {
      throw new BadRequestException('Person not found.');
    }
  }
}
