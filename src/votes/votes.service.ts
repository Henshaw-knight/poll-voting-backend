import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { Repository } from 'typeorm';
import { PollsService } from 'src/polls/polls.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { User } from 'src/users/entities/user.entity';
import { PollStatus } from 'src/polls/entities/poll.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly pollsService: PollsService,
  ) {}

  async castVote(dto: CreateVoteDto, user: User): Promise<Vote> {
    const poll = await this.pollsService.findOne(dto.pollId);

    if (poll.status === PollStatus.CLOSED) {
      throw new BadRequestException(
        'This poll is closed and no longer accepting votes',
      );
    }

    const validOption = poll.options.find((opt) => opt.id === dto.optionId);
    if (!validOption) {
      throw new NotFoundException('Option does not belong to this poll');
    }

    const existingVote = await this.voteRepository.findOne({
      where: { user: { id: user.id }, poll: { id: dto.pollId } },
    });

    if (existingVote) {
      throw new ConflictException('You have already voted on this poll');
    }

    const vote = this.voteRepository.create({
      user,
      poll: { id: dto.pollId },
      option: { id: dto.optionId },
      state: user.state,
    });

    return this.voteRepository.save(vote);
  }
}
