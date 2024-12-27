import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAttendeeDto {
  @ApiProperty({
    description: 'The name of the attendee',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the attendee',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
