import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../shared/enums/roles.enum';

@Controller('semesters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  @Roles(Role.STAFF)
  async create(@Body() data: any) {
    return this.semestersService.create(data);
  }

  @Get()
  async findAll() {
    return this.semestersService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.semestersService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.semestersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.STAFF)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.semestersService.update(id, data);
  }

  @Patch(':id/activate')
  @Roles(Role.STAFF)
  async activate(@Param('id') id: string) {
    return this.semestersService.activate(id);
  }

  @Delete(':id')
  @Roles(Role.STAFF)
  async remove(@Param('id') id: string) {
    return this.semestersService.remove(id);
  }
}
