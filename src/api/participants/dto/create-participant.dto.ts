import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty({ type: String, example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ type: String, example: 'test@test.com' })
  @IsOptional()
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String, example: 'testpassword' })
  @IsOptional()
  public password: string;

  @ApiProperty({ default: true })
  @IsOptional()
  public isActive?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  public isLogin: boolean;

  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  public activityId?: number;

  @ApiProperty({ type: String, example: 'qualtics-16004' })
  @IsOptional()
  public participantId: string;

  @ApiProperty({ type: String, example: 'qualtics-login-234' })
  @IsOptional()
  public participantCode: string;
}
