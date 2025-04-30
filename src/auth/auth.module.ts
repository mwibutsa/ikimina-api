import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GroupModule } from '../group/group.module';
import { GroupCreatorGuard } from './guards/group-creator.guard';
import { GroupMemberGuard } from './guards/group-member.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => GroupModule),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: GroupCreatorGuard,
      useClass: GroupCreatorGuard,
    },
    {
      provide: GroupMemberGuard,
      useClass: GroupMemberGuard,
    },
  ],
  exports: [AuthService, JwtStrategy, GroupCreatorGuard, GroupMemberGuard],
})
export class AuthModule {}
