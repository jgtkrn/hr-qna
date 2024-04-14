import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { RequestStatus } from '../entities/enum/request-status.enum';

export class CreateSubscriptionHistoryDto {
  @ApiProperty({ example: 1000 })
  @IsOptional()
  public amount: number;

  @ApiProperty({ example: true })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestStatus)
  public status: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  public userId?: number;
}
