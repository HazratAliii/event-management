import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { PrismaService } from 'prisma/prisma.service';

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
}
