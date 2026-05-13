import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PollsService } from './polls.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollStatus } from './entities/poll.entity';
import { UpdatePollDto } from './dto/update-poll.dto';
import { UpdatePollStatusDto } from './dto/update-poll-status.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePollDto, @Request() req: any) {
    return this.pollsService.create(dto, req.user);
  }

  @Get()
  findAll(@Query('status') status?: PollStatus) {
    return this.pollsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePollDto) {
    return this.pollsService.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePollStatusDto) {
    return this.pollsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}
