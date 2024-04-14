import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterParticipantHistoryDto {
  @ApiProperty()
  @IsOptional()
  public type: string;
}
