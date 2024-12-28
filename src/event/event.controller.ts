import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('api/event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: 'Create an Event' })
  @ApiResponse({
    status: 201,
    description: 'Event created',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Res() res: Response) {
    try {
      const result = await this.eventService.create(createEventDto);
      return res.status(201).json({
        message: 'Event created',
        data: result,
        statusCode: 201,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Get All events' })
  @ApiResponse({
    status: 200,
    description: 'Get all events',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.eventService.findAll();
      return res.status(200).json({
        message: 'All events',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Get event details' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    // try {
    //   const result = await this.eventService.findOne(id);
    //   return res.status(200).json({
    //     message: 'Event details',
    //     data: result,
    //     statusCode: 200,
    //   });
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     return res
    //       .status(404)
    //       .json({ message: error.message, statusCode: 404 });
    //   }
    //   return res.status(500).json({ message: error.message, statusCode: 500 });
    // }
    try {
      const cacheKey = `event:${id}`;
      let result = await this.cacheManager.get(cacheKey);

      if (!result) {
        result = await this.eventService.findOne(id);
        if (!result) {
          throw new NotFoundException('Event not found');
        }
        await this.cacheManager.set(cacheKey, result, 600);
      }

      return res.status(200).json({
        message: 'Event details',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .json({ message: error.message, statusCode: 404 });
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 200,
    description: 'Event Updated',
    type: UpdateEventDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.eventService.update(id, updateEventDto);
      return res.status(200).json({
        message: 'Event details updated',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .json({ message: error.message, statusCode: 404 });
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.eventService.remove(id);
      return res.status(200).json({
        message: 'Event deleted',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .json({ message: error.message, statusCode: 404 });
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }
}
