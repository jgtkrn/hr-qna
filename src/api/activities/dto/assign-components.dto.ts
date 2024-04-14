import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

import { ActivityStatus } from '../entities/enum/activity-status.enum';

class ParticipantComponent {
  @ApiProperty({ example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ type: String, example: 'test@test.com' })
  @IsOptional()
  @IsEmail()
  public email: string;
}

export class AssignComponentsDto {
  @ApiProperty({ example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ example: true })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty({ example: '22-10-2023' })
  @IsOptional()
  public startTime: Date;

  @ApiProperty({ example: '22-10-2023' })
  @IsOptional()
  public endTime: Date;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  public description: string;

  @ApiProperty({ example: 15 })
  @IsOptional()
  public tokenPerUser: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  public tokenMax: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ActivityStatus)
  public status: string;

  @ApiProperty({ example: false })
  @IsOptional()
  public isProctoring: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  public createdBy: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  public updatedBy: number;

  @ApiProperty()
  @IsOptional()
  public testIds: number[];

  @ApiProperty({ type: () => [ParticipantComponent] })
  @IsOptional()
  public participants: ParticipantComponent[];
}
