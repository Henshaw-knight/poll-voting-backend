import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PollsModule } from './polls/polls.module';
import { VotesModule } from './votes/votes.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [AuthModule, UsersModule, PollsModule, VotesModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
