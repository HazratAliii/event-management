import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Tech Conference 2024',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the event',
    example: 'A conference about the latest tech innovations',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The date of the event',
    example: '2024-12-15T09:00:00Z',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'The location where the event will take place',
    example: 'Tech Arena, Silicon Valley',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'The maximum number of attendees allowed for the event',
    example: 200,
  })
  @IsInt()
  @Min(1)
  maxAttendees: number;
}
