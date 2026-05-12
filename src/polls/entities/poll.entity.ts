import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PollOption } from './poll-option.entity';
import { Vote } from '../../votes/entities/vote.entity';

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PollStatus, default: PollStatus.ACTIVE })
  status: PollStatus;

  @ManyToOne(() => User, (user) => user.polls)
  createdBy: User;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
