import { ApiProperty } from '@nestjs/swagger';

export class AbstractEntity {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: Date,
    example: new Date('2024-11-30'),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date('2024-11-30'),
  })
  updatedAt: Date;
}
