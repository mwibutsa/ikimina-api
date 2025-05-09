import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DrawPositionDto } from './dto/draw-position.dto';
import { AdminShuffleDto } from './dto/admin-shuffle.dto';
import { Draw } from '@prisma/client';

@Injectable()
export class DrawService {
  constructor(private readonly prisma: PrismaService) {}

  async drawPosition(drawPositionDto: DrawPositionDto, clientIp?: string) {
    // Verify that the membership exists
    const membership = await this.prisma.membership.findUnique({
      where: { id: drawPositionDto.membershipId },
      include: {
        group: true,
        user: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Check if the group is locked
    if (membership.group.isLocked) {
      throw new BadRequestException(
        'Group is locked, positions cannot be drawn',
      );
    }
    // Check if the member has already drawn a position
    const existingDraw = await this.prisma.draw.findFirst({
      where: {
        membershipId: drawPositionDto.membershipId,
        groupCycle: membership.group.activeCycle,
      },
    });

    if (existingDraw) {
      throw new BadRequestException('Member has already drawn a position');
    }

    // Get all positions that have already been taken
    const takenPositions = await this.prisma.draw.findMany({
      where: { groupId: membership.groupId },
      select: { position: true },
    });

    const takenPositionCounts = takenPositions.reduce(
      (acc, draw) => {
        acc[draw.position] = (acc[draw.position] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    // Calculate available positions
    const totalMembers = membership.group.totalMembers;
    const membersPerRound = membership.group.membersPerRound || 1;
    const maxPosition = Math.ceil(totalMembers / membersPerRound);
    const availablePositions = Array.from(
      { length: maxPosition },
      (_, i) => i + 1,
    ).filter(
      (position) => (takenPositionCounts[position] || 0) < membersPerRound,
    );

    if (availablePositions.length === 0) {
      throw new BadRequestException('All positions have been drawn');
    }

    // Draw a random position from available positions
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const drawnPosition = availablePositions[randomIndex];

    // Create the draw record
    const draw = await this.prisma.draw.create({
      data: {
        groupId: membership.groupId,
        membershipId: membership.id,
        groupCycle: membership.group.activeCycle,
        position: drawnPosition,
        ipAddress: clientIp || '',
      },
      include: {
        membership: {
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
          },
        },
        group: true,
      },
    });

    return draw;
  }

  async adminShuffle(adminShuffleDto: AdminShuffleDto) {
    // Verify that the group exists
    const group = await this.prisma.group.findUnique({
      where: { id: adminShuffleDto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Verify admin code
    if (group.adminCode !== adminShuffleDto.adminCode) {
      throw new BadRequestException('Invalid admin code');
    }

    // Check if group is locked
    if (group.isLocked) {
      throw new BadRequestException(
        'Group is locked, positions cannot be shuffled',
      );
    }

    // Delete any existing draws
    await this.prisma.draw.deleteMany({
      where: { groupId: group.id },
    });

    // Get all memberships
    const memberships = await this.prisma.membership.findMany({
      where: { groupId: group.id },
    });

    // Generate all positions
    const membersPerRound = group.membersPerRound || 1;
    const maxPosition = Math.ceil(group.totalMembers / membersPerRound);
    const positions = Array.from({ length: maxPosition }, (_, i) => i + 1);

    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Assign positions to members
    const draws: Draw[] = [];
    let positionIndex = 0;

    for (const membership of memberships) {
      if (positionIndex >= positions.length) {
        positionIndex = 0;
      }

      const draw = await this.prisma.draw.create({
        data: {
          groupId: group.id,
          membershipId: membership.id,
          position: positions[positionIndex],
          ipAddress: 'admin-shuffle',
          groupCycle: group.activeCycle,
        },
        include: {
          membership: {
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
            },
          },
        },
      });
      draws.push(draw);

      if (
        draws.filter((d) => d.position === positions[positionIndex]).length %
          membersPerRound ===
        0
      ) {
        positionIndex++;
      }
    }

    return draws;
  }

  async getGroupDraws(groupId: string) {
    return this.prisma.draw.findMany({
      where: { groupId },
      include: {
        membership: {
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
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async getMemberPosition(membershipId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: { group: true },
    });

    const draw = await this.prisma.draw.findFirst({
      where: { membershipId, groupCycle: membership?.group.activeCycle },
      include: {
        membership: {
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
          },
        },
        group: true,
      },
    });

    if (!draw) {
      throw new NotFoundException('Member has not drawn a position yet');
    }

    return draw;
  }

  async hasCycleDraw(membershipId: string, groupCycle: number) {
    const draws = await this.prisma.draw.count({
      where: { membershipId, groupCycle },
    });

    return draws > 0;
  }
}
