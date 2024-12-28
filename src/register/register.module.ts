import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { EventsGateway } from 'src/event/event.gateway';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600,
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService, EventsGateway],
})
export class RegisterModule {}
