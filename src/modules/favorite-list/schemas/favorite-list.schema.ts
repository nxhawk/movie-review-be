import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { MovieDto } from 'src/modules/tmdb/dto/movie.dto';

@Schema()
export class FavoriteList extends AbstractEntity {
  @ApiProperty({
    type: String,
    example: '647d7bdf09f812001e5f67ab',
    description: 'Unique ID of the user who owns the favorite list.',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    type: [MovieDto],
    description: 'List of movies marked as favorite by the user.',
  })
  @Prop({ type: [MovieDto], default: [] })
  movies: MovieDto[];
}

export const FavoriteListSchema = SchemaFactory.createForClass(FavoriteList);
