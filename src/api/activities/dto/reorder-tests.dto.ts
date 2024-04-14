import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

interface ActivityTest {
  activityId: number;
  testId: number;
  order: number;
}

export class ReOrderTestsDto {
  @ApiProperty()
  @IsOptional()
  public orders: ActivityTest[];
}
