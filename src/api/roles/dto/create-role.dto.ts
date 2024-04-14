import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ type: String, example: 'test' })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  public isActive: boolean;
}
