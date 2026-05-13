import { IsEnum, IsNotEmpty } from 'class-validator';
import { PollStatus } from '../entities/poll.entity';

export class UpdatePollStatusDto {
  @IsEnum(PollStatus)
  @IsNotEmpty()
  status: PollStatus;
}
