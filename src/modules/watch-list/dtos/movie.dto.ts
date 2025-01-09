import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({ example: 945961 })
  id: number;

  @ApiProperty({ example: false })
  adult: boolean;

  @ApiProperty({
    example: '/iJaSpQNZ8GsqVDWfbCXmyZQXZ5l.jpg',
  })
  backdrop_path: string;

  @ApiProperty({
    example: '/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
  })
  poster_path: string;

  @ApiProperty({ example: 'Alien: Romulus' })
  original_title: string;

  @ApiProperty({ example: 'Alien: Romulus' })
  title: string;

  @ApiProperty({
    example:
      'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
  })
  overview: string;

  @ApiProperty({ example: '2024-08-13' })
  release_date: string;

  @ApiProperty({ example: 'In space, no one can hear you.' })
  tagline: string;

  @ApiProperty({ example: false })
  video: boolean;

  @ApiProperty({ example: 7.23 })
  vote_average: number;

  @ApiProperty({ example: 2574 })
  vote_count: number;
}

export class ListMovieDto {
  @ApiProperty({
    example: 1,
    description: 'The current page number in the paginated response.',
  })
  page: number;

  @ApiProperty({
    example: 500,
    description: 'The total number of pages available in the dataset.',
  })
  total_pages: number;

  @ApiProperty({
    example: 10000,
    description: 'The total number of results available across all pages.',
  })
  total_results: number;

  @ApiProperty({
    type: MovieDto,
    description: 'The list of movies for the current page.',
  })
  results: MovieDto[];
}
