import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  public confirmedPassword: string;

  @ApiProperty()
  @IsOptional()
  public roleId: number;
}
