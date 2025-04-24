import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { MessageModule } from './message/message.module';
import { DrawModule } from './draw/draw.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    GroupModule,
    AuthModule,
    MembershipModule,
    PaymentModule,
    MessageModule,
    DrawModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
