import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(userId: string, createMessageDto: CreateMessageDto) {
    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: createMessageDto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        groupId: createMessageDto.groupId,
        senderId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        group: true,
      },
    });

    return message;
  }

  async getGroupMessages(groupId: string) {
    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
