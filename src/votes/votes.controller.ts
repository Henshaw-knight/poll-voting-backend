import { Body, Controller, Post, Request } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  castVote(@Body() dto: CreateVoteDto, @Request() req: any) {
    return this.votesService.castVote(dto, req.user);
  }
}
