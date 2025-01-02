import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({
    type: String,
    example: '12345678',
    description: 'The movie id',
  })
  @IsNotEmpty({ message: 'movieId is required' })
  movieId: string;

  @ApiProperty({
    type: String,
    example: '6776330431b016cad6a4e1f9',
    description: 'The watchlist id',
  })
  @IsNotEmpty({ message: 'watchListId is required' })
  watchListId: string;
}
