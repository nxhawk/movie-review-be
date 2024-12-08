import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendConfirmEmailDto {
  @ApiProperty({
    type: String,
    example: 'nguyenvana@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail({}, { message: 'email is required' })
  email: string;
}
