import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationTask } from './notification.task';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [NotificationService, NotificationTask, PrismaService],
})
export class NotificationModule {}
