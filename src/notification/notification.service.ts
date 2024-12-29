import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async notifyUpcomingEvents() {
    const twentyFourHoursFromNow = new Date();
    twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);

    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        date: {
          lte: twentyFourHoursFromNow,
          gte: new Date(),
        },
      },
      include: {
        Registrations: {
          include: { Attendee: true },
        },
      },
    });

    for (const event of upcomingEvents) {
      for (const registration of event.Registrations) {
        const attendee = registration.Attendee;
        await this.sendEmail(
          attendee.email,
          `Reminder: ${event.name} is starting soon`,
          `Hello ${attendee.name},\n\nThe event "${event.name}" is starting at ${event.date.toISOString()}.\nLocation: ${event.location || 'Online'}\n\nSee you there!`,
        );
      }
    }
  }

  private async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL,
      to,
      subject,
      text,
    });
  }
}
