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

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Prop({ default: false })
  verify: boolean;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTQ5MzI0LCJleHAiOjE2ODU5NDkzMjd9.JAFScDSW24LJjlLBrfuB2PxG7f7jaw3NVMgrCDmFjoA',
  })
  @Prop()
  verifyEmailToken: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
