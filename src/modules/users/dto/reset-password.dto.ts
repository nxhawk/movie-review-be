import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTQ5MzI0LCJleHAiOjE2ODU5NDkzMjd9.JAFScDSW24LJjlLBrfuB2PxG7f7jaw3NVMgrCDmFjoA',
    description: 'The token of the reset password',
  })
  @IsNotEmpty({ message: 'token is required' })
  token: string;

  @ApiProperty({
    type: String,
    example: '12345678',
    description: 'The password of the user',
  })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;
}
