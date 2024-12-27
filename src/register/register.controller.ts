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
  ConflictException,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

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
      }
      return res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.registerService.findAll();
    } catch (error) {}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registerService.update(+id, updateRegisterDto);
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
