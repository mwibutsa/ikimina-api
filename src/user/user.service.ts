import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber: user.phoneNumber },
    });
    if (existingUser) {
      throw new ConflictException(
        'User with the provided phone number already exists',
      );
    }

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

  getUserByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  updateUser(id: string, userData: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }
}

// http://localhost:3000/join?code=938D8903
// 45E6047AA1
