import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { HealthIndicator } from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaOrmHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async pingCheck(databaseName: string) {
    try {
      const result = await this.prismaService.$runCommandRaw({
        ping: 1,
      });

      if (result.ok === 1) {
        return this.getStatus(databaseName, true);
      }
      throw new Error('Ping failed');
    } catch (e) {
      throw new InternalServerErrorException('Prisma check failed', e);
    }
  }
}
