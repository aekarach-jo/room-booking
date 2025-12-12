import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { Prisma } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.STAFF)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.STAFF)
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.STAFF)
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  @Roles(Role.STAFF)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
