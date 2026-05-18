import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollsService } from 'src/polls/polls.service';
import { Vote } from 'src/votes/entities/vote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    private readonly pollsService: PollsService,
  ) {}

  async getResults(pollId: string, state?: string) {
    // verify poll exists first
    const poll = await this.pollsService.findOne(pollId);

    const query = this.voteRepository
      .createQueryBuilder('vote')
      .leftJoinAndSelect('vote.option', 'option')
      .where('vote.pollId = :pollId', { pollId })
      .select([
        'option.id AS "optionId"',
        'option.optionText AS "optionText"',
        'COUNT(vote.id) AS "voteCount"',
      ])
      .groupBy('option.id')
      .addGroupBy('option.optionText')
      .orderBy('"voteCount"', 'DESC');

    if (state) {
      query.andWhere('vote.state = :state', { state });
    }

    const results = await query.getRawMany();

    const totalVotes = results.reduce(
      (sum, row) => sum + Number(row.voteCount),
      0,
    );

    return {
      pollId: poll.id,
      title: poll.title,
      status: poll.status,
      totalVotes,
      filteredByState: state ?? null,
      results: results.map((row) => ({
        optionId: row.optionId,
        optionText: row.optionText,
        voteCount: Number(row.voteCount),
        percentage:
          totalVotes > 0
            ? Math.round((Number(row.voteCount) / totalVotes) * 100)
            : 0,
      })),
    };
  }
}
