import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { PrismaService } from 'prisma/prisma.service';
import { AttendeeModule } from './attendee/attendee.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [EventModule, AttendeeModule, RegisterModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
