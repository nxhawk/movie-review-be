import { ApiProperty } from '@nestjs/swagger';

export class ErrorResourceDto {
  @ApiProperty({ example: 34 })
  status_code: number;

  @ApiProperty({ example: 'The resource you requested could not be found.' })
  status_message: string;

  @ApiProperty({ example: false })
  success: boolean;
}
