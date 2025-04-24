import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: user,
    });
  }
  getUserByGroup(groupId: string) {
    return this.prisma.user.findMany({
      where: {
        membership: {
          some: {
            groupId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  updateUser(id: string, userData: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }
}
