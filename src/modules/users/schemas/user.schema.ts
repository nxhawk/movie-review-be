import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../../common/entity/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends AbstractEntity {
  @ApiProperty({
    type: String,
    example: 'nguyenvana@gmail.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Nguyen Van A',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: String,
    example: '12345678',
  })
  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
