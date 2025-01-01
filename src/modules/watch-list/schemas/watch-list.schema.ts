import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { MovieDto } from 'src/modules/tmdb/dto/movie.dto';

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
    type: [MovieDto],
    description: 'List of movies the user intends to watch.',
  })
  @Prop({ type: [MovieDto], default: [] })
  movies: MovieDto[];

  @ApiProperty({
    type: Date,
    example: '2024-12-31T10:00:00.000Z',
    description: 'The date and time when the watch list was last updated.',
  })
  @Prop({ default: Date.now })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    example: '2024-12-01T10:00:00.000Z',
    description: 'The date and time when the watch list was created.',
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WatchListSchema = SchemaFactory.createForClass(WatchList);
