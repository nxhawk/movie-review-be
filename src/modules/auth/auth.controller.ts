import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Delete,
  Get,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROUTES } from '../../constants/route';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { IOAuthRequest, IUserRequest } from '../../interfaces';
import {
  FacebookAuthGuard,
  GoogleAuthGuard,
  LocalAuthGuard,
} from '../../guards';
import { User } from '../users/schemas/user.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResendConfirmEmailDto } from './dto/resend-confirm-email.dto';

@ApiTags('Authentication')
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Register successful',
        },
      },
    },
  })
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  @Get('google')
  loginGoogle() {
    return HttpStatus.OK;
  }

  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google callback' })
  @Get('google/redirect')
  @Redirect()
  async loginWithGoogleCallback(@Req() req: IOAuthRequest) {
    const url = await this.authService.loginGoogle(req);
    return {
      url: url,
    };
  }

  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Login with Facebook' })
  @Get('facebook')
  loginWithFacebook() {
    return HttpStatus.OK;
  }

  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Login with Facebook callback' })
  @Get('facebook/redirect')
  @Redirect()
  async loginWithFacebookCallback(@Req() req: IOAuthRequest) {
    const url = await this.authService.loginFacebook(req);
    return {
      url: url,
    };
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: AuthCredentialsDto })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login successfully',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTQ5MzI0LCJleHAiOjE2ODU5NDkzMjd9.JAFScDSW24LJjlLBrfuB2PxG7f7jaw3NVMgrCDmFjoA',
            },
            refreshToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTQ5MzI0LCJleHAiOjE2ODU5NDkzMjd9.JAFScDSW24LJjlLBrfuB2PxG7f7jaw3NVMgrCDmFjoA',
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Req() req: IUserRequest) {
    return this.authService.login(req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not found' },
      },
    },
  })
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async me(@Req() req: IUserRequest) {
    return this.authService.getMe(req.user.email);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Register successfully',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTQ5MzI0LCJleHAiOjE2ODU5NDkzMjd9.JAFScDSW24LJjlLBrfuB2PxG7f7jaw3NVMgrCDmFjoA',
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Refresh token' })
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  findOne(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('resend-confirm-email')
  @ApiBody({ type: ResendConfirmEmailDto })
  @ApiOperation({ summary: 'Resend confirm email' })
  resendConfirmEmail(@Body() resendConfirmEmailDto: ResendConfirmEmailDto) {
    return this.authService.resendConfirmEmail(resendConfirmEmailDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiOperation({ summary: 'Logout' })
  @HttpCode(HttpStatus.OK)
  @Delete('/logout')
  async signOut(@Req() req: IUserRequest) {
    return this.authService.logout(req.user.email);
  }
}
