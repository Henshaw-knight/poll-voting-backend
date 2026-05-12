import { PollOption } from 'src/polls/entities/poll-option.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['user', 'poll']) // DB-level constraint: one vote per user per poll
@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes)
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes)
  option: PollOption;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;
}
