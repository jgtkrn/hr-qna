import { IsNotEmpty, IsOptional } from 'class-validator';

export class SaveFileDataDto {
  @IsNotEmpty()
  public filename: string;

  @IsNotEmpty()
  public extension: string;

  @IsOptional()
  public size: number;

  @IsNotEmpty()
  public url: string;
}
