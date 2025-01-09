import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ROUTES } from 'src/constants/route';

import { PrismaOrmHealthIndicator } from 'src/shared/prisma/prisma.health';

@Controller(ROUTES.HEALTH)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaOrmHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check the health of the application' })
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
