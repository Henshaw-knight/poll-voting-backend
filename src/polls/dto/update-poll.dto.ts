import { IsOptional, IsString } from 'class-validator';

export class UpdatePollDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
