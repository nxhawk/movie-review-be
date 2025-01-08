import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';
import { TOKEN_MESSAGES, USERS_MESSAGES } from 'src/constants/message';
import { TokenInvalidException } from 'src/exceptions';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class WatchlistMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    const watchlistId =
      req.params.watchlistId || req.params.id || req.params.watchLisId;

    if (!watchlistId) {
      throw new BadRequestException('Watchlist ID is required');
    }

    const watchlist = await this.prisma.watchList.findFirst({
      where: {
        id: watchlistId,
      },
    });

    if (!watchlist) {
      throw new BadRequestException('Watchlist not found');
    }

    if (watchlist.isPublic) {
      return next();
    }

    if (!token) {
      throw new BadRequestException('Unauthorized access');
    }

    const payload: {
      id: number;
      email: string;
      exp: number;
    } = this.jwtService.verify(token, {
      secret: this.config.getOrThrow<string>('auth.accessTokenSecret'),
      ignoreExpiration: true,
    });

    if (!payload) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (payload.exp <= currentTimeInSeconds) {
      throw new UnauthorizedException(TOKEN_MESSAGES.TOKEN_IS_EXPIRED);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new BadRequestException(USERS_MESSAGES.USER_NOT_FOUND);
    }

    if (watchlist.userId !== user.id) {
      throw new BadRequestException('Unauthorized access');
    }
    next();
  }
}
