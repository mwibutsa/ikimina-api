import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { DrawService } from '../draw/draw.service';
@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly drawService: DrawService,
  ) {}

  async joinGroup(joinGroupDto: JoinGroupDto, clientIp?: string) {
    // Verify group exists and is not locked
    const group = await this.groupService.getGroupByInvitationCode(
      joinGroupDto.invitationCode,
    );

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.isLocked) {
      throw new BadRequestException('Group is locked, new members cannot join');
    }

    // Check if user exists by email, or create a new user
    let user = joinGroupDto.phoneNumber
      ? await this.userService.getUserByPhoneNumber(joinGroupDto.phoneNumber)
      : null;

    if (!user) {
      // Create new user
      user = await this.userService.createUser({
        email: joinGroupDto.email,
        firstName: joinGroupDto.firstName,
        lastName: joinGroupDto.lastName,
        phoneNumber: joinGroupDto.phoneNumber,
        ipAddress: clientIp || '',
      });
    }

    // Check if user is already a member and has drawn a spot
    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        groupMembership: {
          groupId: group.id,
          userId: user.id,
        },
      },
      include: {
        draws: true,
      },
    });

    if (existingMembership) {
      // Only reject if they've already drawn a spot
      if (
        await this.drawService.hasCycleDraw(
          existingMembership.id,
          group.activeCycle || 1,
        )
      ) {
        throw new BadRequestException(
          'User has already drawn a spot in this group',
        );
      }

      // If they haven't drawn a spot, return their existing membership
      return existingMembership;
    }

    // Check if group has reached its member limit
    const currentMembers = await this.prisma.membership.count({
      where: {
        groupId: group.id,
      },
    });

    if (currentMembers >= group.totalMembers) {
      throw new BadRequestException('Group has reached its member limit');
    }

    // Create membership
    const membership = await this.prisma.membership.create({
      data: {
        groupId: group.id,
        userId: user.id,
      },
      include: {
        group: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        draws: true,
      },
    });

    return membership;
  }

  async getGroupMembers(groupId: string, adminCode?: string) {
    // Optionally validate admin code
    if (adminCode) {
      const isValidAdmin = await this.groupService.verifyAdminCode(
        groupId,
        adminCode,
      );
      if (!isValidAdmin) {
        throw new BadRequestException('Invalid admin code');
      }
    }

    // Get all members
    const members = await this.prisma.membership.findMany({
      where: {
        groupId,
      },
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
        draws: true,
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            dueDate: true,
            paidAt: true,
          },
        },
      },
    });

    return members;
  }

  async getMembershipById(id: string) {
    return this.prisma.membership.findUnique({
      where: { id },
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
        group: true,
        draws: true,
      },
    });
  }

  async getUserMemberships(phoneOrEmail: string) {
    // Check if input is email or phone
    const isEmail = phoneOrEmail.includes('@');

    return this.prisma.membership.findMany({
      where: {
        user: isEmail ? { email: phoneOrEmail } : { phoneNumber: phoneOrEmail },
      },
      include: {
        group: true,
        draws: true,
      },
    });
  }
}
