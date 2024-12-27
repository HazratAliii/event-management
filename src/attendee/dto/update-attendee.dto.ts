import { PartialType } from '@nestjs/swagger';
import { CreateAttendeeDto } from './create-attendee.dto';

export class UpdateAttendeeDto extends PartialType(CreateAttendeeDto) {}
