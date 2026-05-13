import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll, PollStatus } from './entities/poll.entity';
import { Repository } from 'typeorm';
import { PollOption } from './entities/poll-option.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,

    @InjectRepository(PollOption)
    private readonly pollOptionRepository: Repository<PollOption>,
  ) {}

  async create(dto: CreatePollDto, creator: User): Promise<Poll> {
    const poll = this.pollRepository.create({
      title: dto.title,
      description: dto.description,
      createdBy: creator,
    });

    const savedPoll = await this.pollRepository.save(poll);

    const options = dto.options.map((optionText) =>
      this.pollOptionRepository.create({ optionText, poll: savedPoll }),
    );
    await this.pollOptionRepository.save(options);

    return this.findOne(savedPoll.id);
  }

  async findAll(status?: PollStatus): Promise<Poll[]> {
    const query = this.pollRepository
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.options', 'options')
      .leftJoinAndSelect('poll.createdBy', 'createdBy')
      .orderBy('poll.createdAt', 'DESC');

    if (status) {
      query.where('poll.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Poll> {
    const poll = await this.pollRepository.findOne({
      where: { id },
      relations: ['options', 'createdBy'],
    });

    if (!poll) throw new NotFoundException(`Poll not found`);
    return poll;
  }

  async update(id: string, dto: UpdatePollDto): Promise<Poll> {
    const poll = await this.findOne(id);
    Object.assign(poll, dto);
    await this.pollRepository.save(poll);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: PollStatus): Promise<Poll> {
    const poll = await this.findOne(id);
    poll.status = status;
    await this.pollRepository.save(poll);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const poll = await this.findOne(id);
    await this.pollRepository.remove(poll);
  }
}
