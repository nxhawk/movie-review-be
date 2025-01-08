import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';

export class RatingDto {
  @ApiProperty({
    type: Number,
    example: 70,
    description: 'The rating of the movie',
  })
  @IsNotEmpty({ message: 'rating is required' })
  @IsNumber({}, { message: 'rating must be a number' })
  @Min(0, { message: 'rating must be between 0 and 100' })
  @Max(100, { message: 'rating must be between 0 and 100' })
  rating: number;

  @ApiProperty({
    type: [Number],
    example: [1, 2, 3, 0, 2, 3],
    description: 'A list of moods associated with the rating',
  })
  @IsNotEmpty({ message: 'Mood is required' })
  @IsArray({ message: 'Mood must be an array' })
  @ArrayMinSize(7, { message: 'Mood must have 7 elements' })
  @ArrayMaxSize(7, { message: 'Mood must have 7 elements' })
  @Type(() => Number)
  mood: number[];
}
