import { Module } from '@nestjs/common';
import { DrawService } from './draw.service';
import { DrawController } from './draw.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupModule } from '../group/group.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [PrismaModule, GroupModule, MembershipModule],
  providers: [DrawService],
  controllers: [DrawController],
  exports: [DrawService],
})
export class DrawModule {}
