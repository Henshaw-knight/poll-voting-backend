import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from 'src/votes/entities/vote.entity';
import { PollsModule } from 'src/polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
