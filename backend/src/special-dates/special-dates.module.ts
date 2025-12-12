import { Module } from '@nestjs/common';
import { SpecialDatesController } from './special-dates.controller';
import { SpecialDatesService } from './special-dates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialDatesController],
  providers: [SpecialDatesService],
  exports: [SpecialDatesService],
})
export class SpecialDatesModule {}
