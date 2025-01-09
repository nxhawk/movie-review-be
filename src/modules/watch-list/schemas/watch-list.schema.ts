import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { MovieDto } from '../dtos/movie.dto';

@Schema()
export class WatchList extends AbstractEntity {
  @ApiProperty({
    type: String,
    example: '647d7bdf09f812001e5f67ab',
    description: 'Unique ID of the user who owns the watch list.',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    type: String,
    example: 'Summer Movies',
    description: 'Name of the watch list.',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: [MovieDto],
    description: 'List of movies the user intends to watch.',
  })
  @Prop({ type: [MovieDto], default: [] })
  movies: MovieDto[];
}

export const WatchListSchema = SchemaFactory.createForClass(WatchList);
