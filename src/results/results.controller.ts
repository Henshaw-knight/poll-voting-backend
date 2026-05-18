import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResultsService } from './results.service';

@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get(':pollId')
  getResults(@Param('pollId') pollId: string, @Query('state') state?: string) {
    return this.resultsService.getResults(pollId, state);
  }
}
