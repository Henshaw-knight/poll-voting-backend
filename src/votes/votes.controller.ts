import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  castVote(@Body() dto: CreateVoteDto, @Request() req: any) {
    return this.votesService.castVote(dto, req.user);
  }
}
