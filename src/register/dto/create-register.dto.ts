import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateRegisterDto {
  @ApiProperty({
    description: 'The ID of the event to register for',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'The ID of the attendee registering for the event',
    example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4',
  })
  @IsUUID()
  attendeeId: string;

  @ApiProperty({
    description: 'The date and time of registration (optional)',
    example: '2024-01-01T12:00:00Z',
    required: false,
  })
  @IsDateString()
  registeredAt?: string;
}
