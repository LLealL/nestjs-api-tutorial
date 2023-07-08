import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
