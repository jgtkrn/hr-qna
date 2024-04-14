import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { RequestStatus } from '../entities/enum/request-status.enum';

export class ApproveSubscriptionHistoryDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestStatus)
  public status: string;
}
