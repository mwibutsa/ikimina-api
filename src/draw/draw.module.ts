import { Module, forwardRef } from '@nestjs/common';
import { DrawService } from './draw.service';
import { DrawController } from './draw.controller';
import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => MembershipModule),
    forwardRef(() => GroupModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {}
