import { Controller, Get } from '@nestjs/common';
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
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
