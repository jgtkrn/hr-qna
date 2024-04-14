import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, example: 'test' })
  @IsOptional()
  public name: string;

  @ApiProperty({ type: String, example: 'test@test.com' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String, example: 'testpassword' })
  @IsOptional()
  public password: string;

  @ApiProperty()
  @IsOptional()
  public isActive?: boolean;

  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  public roleId?: number;

  @ApiProperty({ type: String, example: 'testuserid' })
  @IsOptional()
  public userId?: string;
}
