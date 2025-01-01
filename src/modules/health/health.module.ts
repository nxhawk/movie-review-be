import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaOrmHealthIndicator } from 'src/shared/prisma/prisma.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaOrmHealthIndicator],
})
export class HealthModule {}
