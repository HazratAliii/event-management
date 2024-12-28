import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { EventsGateway } from './event.gateway';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600,
    }),
  ],
  controllers: [EventController],
  providers: [EventService, PrismaService, EventsGateway],
})
export class EventModule {}
