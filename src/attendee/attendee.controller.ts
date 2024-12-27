import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @ApiOperation({ summary: 'Create an attendee' })
  @ApiResponse({
    status: 201,
    description: 'Attendee created',
    type: CreateAttendeeDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  async create(
    @Body() createAttendeeDto: CreateAttendeeDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.attendeeService.create(createAttendeeDto);
      return res.status(201).json({
        message: 'Attendee created',
        data: result,
        statusCode: 201,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(409).json({ message: error.message, stausCode: 409 });
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Get All attendees' })
  @ApiResponse({
    status: 200,
    description: 'Get all attendees',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.attendeeService.findAll();
      return res.status(200).json({
        message: 'All attendees',
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @ApiOperation({ summary: 'Get attendee details' })
  @ApiResponse({
    status: 200,
    description: 'Attendee details',
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.attendeeService.findOne(id);
      return res.status(200).json({
        message: 'Attendee details',
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

  // Todo: Gotta fix this update problem
  @ApiOperation({ summary: 'Update an attendee information' })
  @ApiResponse({
    status: 200,
    description: 'Attendee information Updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.attendeeService.update(id, updateAttendeeDto);
      return res.status(200).json({
        message: 'Attendee details updated',
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

  @ApiOperation({ summary: 'Delete an attendee' })
  @ApiResponse({
    status: 200,
    description: 'Attendee deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.attendeeService.remove(id);
      return res.status(200).json({
        message: 'Attendee deleted',
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
