import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum SendStatus {
  answer = 'ANSWER',
  submit = 'SUBMIT',
}

export class InsertAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  public qnaId: number;

  @ApiProperty()
  @IsOptional()
  public answer: string;

  @ApiProperty()
  @IsNotEmpty()
  public type: string;

  @ApiProperty()
  @IsNotEmpty()
  public testId: number;

  @ApiProperty({ enum: SendStatus })
  @IsNotEmpty()
  @IsEnum(SendStatus)
  public sendType: string;
}
