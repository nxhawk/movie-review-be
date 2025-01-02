import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWatchListDto {
  @ApiProperty({
    type: String,
    example: 'Summer Movies',
    description: 'The name of the watchlist',
  })
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}
