import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { PrismaService } from 'prisma/prisma.service';
import { AttendeeModule } from './attendee/attendee.module';
import { RegisterModule } from './register/register.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    EventModule,
    AttendeeModule,
    RegisterModule,
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationService],
})
export class AppModule {}
