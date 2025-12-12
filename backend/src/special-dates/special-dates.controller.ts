import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpecialDatesService } from './special-dates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../shared/enums/roles.enum';

@Controller('special-dates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialDatesController {
  constructor(private readonly specialDatesService: SpecialDatesService) {}

  @Post()
  @Roles(Role.STAFF)
  async create(@Body() data: any) {
    return this.specialDatesService.create(data);
  }

  @Get()
  async findAll(@Query('month') month?: string, @Query('year') year?: string) {
    if (month && year) {
      return this.specialDatesService.findByMonth(parseInt(month), parseInt(year));
    }
    return this.specialDatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.specialDatesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.STAFF)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.specialDatesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.STAFF)
  async remove(@Param('id') id: string) {
    return this.specialDatesService.remove(id);
  }
}
