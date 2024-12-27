import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService, PrismaService],
})
export class AttendeeModule {}
