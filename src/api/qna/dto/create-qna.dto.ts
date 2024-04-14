import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQnaDto {
  @ApiProperty()
  @IsOptional()
  public question: string;

  @ApiProperty()
  @IsOptional()
  public answers: string;

  @ApiProperty()
  @IsOptional()
  public key: string;

  @ApiProperty()
  @IsOptional()
  public type: string;

  @ApiProperty({ default: true })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  public testId: number;
}
