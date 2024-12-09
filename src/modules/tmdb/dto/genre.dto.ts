import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty({ example: 27 })
  id: number;

  @ApiProperty({ example: 'Horror' })
  name: string;
}
