import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/createGroup.dto';
import { UserService } from '../user/user.service';
import { randomBytes } from 'crypto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { LockGroupDto } from './dto/lock-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createGroup(userId: string, groupData: CreateGroupDto) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique invitation and admin codes
    const invitationCode = this.generateUniqueCode(8);
    const adminCode = this.generateUniqueCode(10); // Longer, more secure admin code

    const newGroup: Prisma.GroupCreateInput = {
      name: groupData.name,
      invitationCode,
      adminCode,
      contributionPeriod: groupData.contributionPeriod,
      contributionAmount: groupData.contributionAmount,
      contributionCurrency: groupData.contributionCurrency,
      drawMode: groupData.drawMode,
      totalMembers: groupData.totalMembers || 10,
      creator: {
        connect: {
          id: user.id,
        },
      },
    };

    // Create the group
    const group = await this.prisma.group.create({
      data: newGroup,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Create membership for the creator (admin)
    await this.prisma.membership.create({
      data: {
        groupId: group.id,
        userId: user.id,
      },
    });

    return {
      ...group,
      invitationCode: group.invitationCode,
      adminCode: group.adminCode,
    };
  }

  async getGroupById(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        Membership: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
            Draw: true,
          },
        },
        Draw: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async getGroupByInvitationCode(invitationCode: string) {
    return this.prisma.group.findUnique({
      where: { invitationCode },
    });
  }

  async verifyAdminCode(groupId: string, adminCode: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group.adminCode === adminCode;
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
    adminCode: string,
  ) {
    // Check if group exists
    const group = await this.getGroupById(id);

    // Verify admin code
    if (group.adminCode !== adminCode) {
      throw new BadRequestException('Invalid admin code');
    }

    // Update the group
    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async lockGroup(id: string, lockGroupDto: LockGroupDto) {
    // Check if group exists
    const group = await this.getGroupById(id);

    // Verify admin code
    if (group.adminCode !== lockGroupDto.adminCode) {
      throw new BadRequestException('Invalid admin code');
    }

    // Lock the group
    return this.prisma.group.update({
      where: { id },
      data: {
        isLocked: true,
      },
    });
  }

  async findGroupsByPhone(phoneNumber: string) {
    // Find all groups where a user with the given phone number is a member
    const memberships = await this.prisma.membership.findMany({
      where: {
        user: {
          phoneNumber,
        },
      },
      include: {
        group: true,
      },
    });

    return memberships.map((membership) => membership.group);
  }

  private generateUniqueCode(length = 6): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
      .toUpperCase();
  }
}
