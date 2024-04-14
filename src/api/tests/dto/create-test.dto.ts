import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateTestDto {
  @ApiProperty({ example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ example: true })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  public description: string;

  @ApiProperty({ example: 2 })
  @IsOptional()
  public token: number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  public duration: number;

  @ApiProperty()
  @IsOptional()
  public thumbnail: string;

  @ApiProperty()
  @IsOptional()
  public type: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  public status: string;
}
