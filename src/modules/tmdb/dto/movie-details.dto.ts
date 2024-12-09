import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';
import { GenreDto } from './genre.dto';

export class MovieDetailsDto extends MovieDto {
  @ApiProperty({ type: [GenreDto] })
  genres: GenreDto[];

  @ApiProperty({ example: 866.669 })
  popularity: number;

  @ApiProperty({ example: 350861031 })
  revenue: number;

  @ApiProperty({ example: 'Released' })
  status: string;

  @ApiProperty({ example: 119 })
  runtime: number;
}
