import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMailRegulerDto {
  @ApiProperty({ type: String, example: 'No-Reply <mail@mail.com>' })
  @IsOptional()
  public from?: string;

  @ApiProperty({ type: String, example: 'mail@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  public to: string | string[];

  @ApiProperty({ type: String, example: 'Send Email Test' })
  @IsNotEmpty()
  public subject: string;

  @ApiProperty({ type: String, example: '<strong>Send Mail Body</strong>' })
  @IsOptional()
  public html: string;
}
