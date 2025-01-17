import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROUTES } from '../../constants/route';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Send an email to reset password' })
  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Verify the forgot password token' })
  @Get('verify/forgot-password')
  @Redirect()
  verifyForgotPassword(@Query('token') token: string) {
    const url = this.usersService.verifyForgotPassword(token);
    return {
      url: url,
    };
  }

  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({ summary: 'Reset the password' })
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
