import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    type: String,
    example: 'nguyenvana@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail({}, { message: 'email is required' })
  email: string;

  @ApiProperty({
    type: String,
    example: '12345678',
    description: 'The password of the user',
  })
  @IsNotEmpty({ message: 'passsword is required' })
  @MinLength(8, { message: 'passsword must be at least 8 characters' })
  password: string;
}
