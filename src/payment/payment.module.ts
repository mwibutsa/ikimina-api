import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupModule } from '../group/group.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [PrismaModule, GroupModule, MembershipModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
