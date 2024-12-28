import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { EventsGateway } from 'src/event/event.gateway';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGatewy: EventsGateway,
  ) {}
  async create(createRegisterDto: CreateRegisterDto) {
    try {
      const eventExists = await this.prisma.event.findUnique({
        where: { id: createRegisterDto.eventId },
      });
      const attendeeExists = await this.prisma.attendee.findUnique({
        where: { id: createRegisterDto.attendeeId },
      });
      const registrationExists = await this.prisma.registration.findFirst({
        where: {
          eventId: createRegisterDto.eventId,
          Attendee: {
            email: attendeeExists.email,
          },
        },
      });
      if (!eventExists) throw new NotFoundException('Event not found');
      if (!attendeeExists) throw new NotFoundException('Attendee not found');
      if (registrationExists) throw new ConflictException('Alreday registered');

      const registered = await this.prisma.registration.create({
        data: {
          eventId: createRegisterDto.eventId,
          attendeeId: createRegisterDto.attendeeId,
          registeredAt: createRegisterDto.registeredAt,
        },
      });
      await this.prisma.event.update({
        where: { id: createRegisterDto.eventId },
        data: { attendees: { increment: 1 } },
      });
      const remainingSpots = eventExists.maxAttendees - eventExists.attendees;
      if (remainingSpots <= 6) {
        this.eventsGatewy.notifySpotsFillingUp(eventExists.id, remainingSpots);
      }
      await this.sendVerificationEmail(attendeeExists.email, eventExists.name);
      return registered;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {}

  async findOne(id: string) {
    try {
      const eventExists = await this.prisma.event.findUnique({ where: { id } });
      if (!eventExists) throw new NotFoundException('Event not found');
      const attendees = await this.prisma.attendee.findMany({
        where: {
          Registrations: {
            some: {
              eventId: id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return attendees;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateRegisterDto: UpdateRegisterDto) {
    return `This action updates a #${id} register`;
  }

  async remove(id: string) {
    try {
      const deletedRegister = await this.prisma.registration.delete({
        where: { id },
      });
      await this.prisma.event.update({
        where: { id },
        data: { attendees: { decrement: 1 } },
      });
      return deletedRegister;
    } catch (error) {
      throw error;
    }
  }

  // Helper functions
  async sendVerificationEmail(email: string, eventName: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: 'Event registration confirmation',
        text: `You have registered successfully for the event "${eventName}"`,
      };

      await transporter.sendMail(mailOptions);
      // console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Failed to send verification email:', error.message);
      throw new Error('Failed to send verification email');
    }
  }
}
