import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { DrawService } from '#/draw/draw.service';

@Module({
  imports: [PrismaModule, UserModule, GroupModule],
  providers: [MembershipService, DrawService],
  controllers: [MembershipController],
  exports: [MembershipService],
})
export class MembershipModule {}
