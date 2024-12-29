import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AttendeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttendeeDto: CreateAttendeeDto) {
    try {
      const attendeeExists = await this.prisma.attendee.findUnique({
        where: { email: createAttendeeDto.email },
      });
      if (attendeeExists)
        throw new ConflictException(
          'An attendee with this email already exists',
        );
      const isValidEmail = await this.validateEmail(createAttendeeDto.email);
      if (isValidEmail !== 'valid')
        throw new BadRequestException('Please provide a valid email');
      const attendee = await this.prisma.attendee.create({
        data: {
          name: createAttendeeDto.name,
          email: createAttendeeDto.email,
        },
      });
      return attendee;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const attendees = await this.prisma.attendee.findMany();
      return attendees;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const attendeeExists = await this.prisma.attendee.findUnique({
        where: { id },
      });
      if (!attendeeExists) throw new NotFoundException('Attendee not found');
      return attendeeExists;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    try {
      const attendeeExists = await this.prisma.attendee.findUnique({
        where: { id },
      });
      if (!attendeeExists) throw new NotFoundException('Attendee not found');
      const updatedAttendee = await this.prisma.attendee.update({
        where: { id },
        data: {
          name: updateAttendeeDto.name || attendeeExists.name,
          email: updateAttendeeDto.email || attendeeExists.email,
        },
      });
      return updatedAttendee;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const attendeeExists = await this.prisma.attendee.findUnique({
        where: { id },
      });
      if (!attendeeExists) throw new NotFoundException('Attendee not found');
      return this.prisma.attendee.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
  async searchAttendees(query: string) {
    try {
      console.log('inside search');
      console.log(`trim ${query}`);
      const trimmedQuery = query.trim(); // Remove any extra spaces
      const attendees = await this.prisma.attendee.findMany({
        where: {
          OR: [
            { name: { contains: trimmedQuery, mode: 'insensitive' } },
            { email: { contains: trimmedQuery, mode: 'insensitive' } },
          ],
        },
      });
      if (!attendees || attendees.length === 0) {
        throw new NotFoundException('Attendees not found');
      }
      console.log(attendees);
      return attendees;
    } catch (error) {
      throw error;
    }
  }

  //Helper functions
  async validateEmail(email: string) {
    const zeroBounchApiKey = process.env.ZERO_BOUNCE_API_KEY;
    console.log(zeroBounchApiKey);
    const url = `https://api.zerobounce.net/v2/validate?api_key=${zeroBounchApiKey}&email=${email}`;
    try {
      const res = await axios.get(url);
      return res.data.status;
    } catch (error) {
      console.log(`Error validating email: ${error.message}`);
      return null;
    }
  }
}
