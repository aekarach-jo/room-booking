import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../shared/enums/roles.enum';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  async create(@Body() data: any, @Request() req) {
    return this.announcementsService.create(data, req.user.id);
  }

  @Get()
  async findAll() {
    return this.announcementsService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.announcementsService.update(id, data);
  }

  @Patch(':id/pin')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  async pin(@Param('id') id: string) {
    return this.announcementsService.togglePin(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  async remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
