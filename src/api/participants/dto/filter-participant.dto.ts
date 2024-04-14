import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FilterParticipantDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  public activityId: number;
}
