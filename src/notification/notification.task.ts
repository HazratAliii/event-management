import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationTask {
  constructor(private readonly notificationService: NotificationService) {}

  @Cron('*/1 * * * *')
  async handleCron() {
    console.log('Cron is running');
    await this.notificationService.notifyUpcomingEvents();
  }
}
