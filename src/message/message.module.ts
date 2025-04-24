import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [PrismaModule, GroupModule],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
