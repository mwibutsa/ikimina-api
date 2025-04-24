import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { PrismaModule } from '#/prisma/prisma.module';
import { UserModule } from '#/user/user.module';
import { GroupController } from './group.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [GroupService],
  exports: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
