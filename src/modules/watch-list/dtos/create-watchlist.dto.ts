import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWatchListDto {
  @ApiProperty({
    type: String,
    example: 'Summer Movies',
    description: 'The name of the watchlist',
  })
  @MaxLength(50, { message: 'name has maximum length of 50' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Movies to watch in the summer',
    description: 'The description of the watchlist',
  })
  @IsString({ message: 'description must be a string' })
  description?: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'The visibility of the watchlist',
  })
  @IsNotEmpty({ message: 'isPublic is required' })
  @IsBoolean({ message: 'isPublic must be a boolean' })
  isPublic: boolean;
}
