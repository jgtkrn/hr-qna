import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1000 })
  @IsOptional()
  public amount: number;

  @ApiProperty({ example: true })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  public userId: number;
}
