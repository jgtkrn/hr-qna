import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AssignTestsDto {
  @ApiProperty()
  @IsOptional()
  public testIds: number[];
}
