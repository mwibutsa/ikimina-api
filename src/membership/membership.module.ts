import { Module, forwardRef } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DrawModule } from '../draw/draw.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => GroupModule),
    PrismaModule,
    DrawModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
