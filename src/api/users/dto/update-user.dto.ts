import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: String, example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ type: String, example: 'test' })
  @IsOptional()
  public email: string;

  @ApiProperty({ type: String, example: 'test' })
  @IsOptional()
  public password: string;

  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  public roleId: number;

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  public isActive: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsOptional()
  public isLogin: boolean;
}
