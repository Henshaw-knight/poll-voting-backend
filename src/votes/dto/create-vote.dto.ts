import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateVoteDto {
  @IsUUID()
  @IsNotEmpty()
  pollId: string;

  @IsUUID()
  @IsNotEmpty()
  optionId: string;
}