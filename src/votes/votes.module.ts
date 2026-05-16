import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { PollsModule } from 'src/polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
