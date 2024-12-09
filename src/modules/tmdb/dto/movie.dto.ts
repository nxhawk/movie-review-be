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
