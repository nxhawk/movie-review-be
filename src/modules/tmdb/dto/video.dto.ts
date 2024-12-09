import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty({ example: 'en', description: 'ISO 639-1 language code' })
  iso_639_1: string;

  @ApiProperty({ example: 'US', description: 'ISO 3166-1 country code' })
  iso_3166_1: string;

  @ApiProperty({
    example: 'Now Streaming On Hulu and Hulu on Disney+',
    description: 'The name or title of the video',
  })
  name: string;

  @ApiProperty({
    example: 'bQlwYnouC98',
    description: 'The video key for the hosting platform (e.g., YouTube)',
  })
  key: string;

  @ApiProperty({
    example: 'YouTube',
    description: 'The site where the video is hosted',
  })
  site: string;

  @ApiProperty({ example: 1080, description: 'The resolution of the video' })
  size: number;

  @ApiProperty({
    example: 'Teaser',
    description: 'The type of video, e.g., Teaser, Trailer',
  })
  type: string;

  @ApiProperty({
    example: true,
    description: 'Whether the video is officially released',
  })
  official: boolean;

  @ApiProperty({
    example: '2024-11-21T17:00:38.000Z',
    description: 'The date and time when the video was published',
    type: String,
  })
  published_at: string;

  @ApiProperty({
    example: '673fb347d7bee5585c559597',
    description: 'The unique identifier of the video',
  })
  id: string;
}

export class ListVideoDto {
  @ApiProperty({
    example: 945961,
    description: 'The unique identifier of the movie',
  })
  id: number;

  @ApiProperty({
    type: VideoDto,
    description: 'The list of videos for the movie',
  })
  results: VideoDto[];
}
