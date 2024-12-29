import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  NotFoundException,
  ConflictException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

@Controller('api/register')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: 'Register for an event' })
  @ApiResponse({
    status: 200,
    description: 'Event Updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Event or attendee not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Already registered',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  async create(
    @Body() createRegisterDto: CreateRegisterDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.registerService.create(createRegisterDto);
      return res.status(201).json({
        message: 'Attendee registered',
        data: result,
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .json({ message: error.message, statusCode: 404 });
      } else if (error instanceof ConflictException) {
        return res
          .status(409)
          .json({ message: error.message, statusCode: 409 });
      } else if (error instanceof BadRequestException) {
        return res
          .status(400)
          .json({ message: error.message, statusCode: 400 });
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'List of attendees for an event' })
  @ApiResponse({
    status: 200,
    description: 'All the attendees for this event',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const cacheKey = `event_${id}_attendees`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({
          message: 'All the attendees for this event (cached)',
          data: cachedData,
          statusCode: 200,
        });
      }
      const result = await this.registerService.findOne(id);

      if (!result) {
        throw new NotFoundException('Event not found');
      }
      await this.cacheManager.set(cacheKey, result, 600);

      return res.status(200).json({
        message: 'All the attendees for this event',
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

  @ApiOperation({ summary: 'Cancel a registration' })
  @ApiResponse({
    status: 200,
    description: 'Registration canceled',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.registerService.remove(id);
      return res.status(200).json({
        message: 'Registration canceled for an event',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }
}
