import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EventsGateway } from './event.gateway';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const event = await this.prisma.event.create({
        data: {
          name: createEventDto.name,
          description: createEventDto.description,
          date: createEventDto.date,
          location: createEventDto.location,
          maxAttendees: createEventDto.maxAttendees,
        },
      });
      this.eventsGateway.notifyNewEvent(event);
      return event;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const events = await this.prisma.event.findMany();
      return events;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const eventExists = await this.prisma.event.findUnique({ where: { id } });
      if (!eventExists) throw new NotFoundException('Event not found');
      const event = await this.prisma.event.findUnique({ where: { id } });
      return event;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      const eventExists = await this.prisma.event.findUnique({ where: { id } });
      if (!eventExists) throw new NotFoundException('Event not found');
      const updateEvent = await this.prisma.event.update({
        where: { id },
        data: {
          name: updateEventDto.name || eventExists.name,
          description: updateEventDto.description || eventExists.description,
          date: updateEventDto.date || eventExists.date,
          location: updateEventDto.location || eventExists.location,
          maxAttendees: updateEventDto.maxAttendees || eventExists.maxAttendees,
        },
      });
      return updateEvent;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const eventExists = await this.prisma.event.findUnique({ where: { id } });
      if (!eventExists) throw new NotFoundException('Event not found');
      return await this.prisma.event.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
