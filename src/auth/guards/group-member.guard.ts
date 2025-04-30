import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
  params: {
    id?: string;
    groupId?: string;
    membershipId?: string;
  };
}

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const groupId = request.params.id || request.params.groupId;
    const membershipId = request.params.membershipId;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // If we have a membershipId in the request, we need to check if the user is the owner of that membership
    if (membershipId) {
      try {
        const membership = await this.prisma.membership.findUnique({
          where: { id: membershipId },
          include: { group: true },
        });

        if (!membership) {
          throw new NotFoundException('Membership not found');
        }

        // Check if the user is the owner of this membership
        if (membership.userId === user.id) {
          return true;
        }

        // If not the owner, set groupId to check if user is a member of the same group
        if (groupId === undefined) {
          request.params.groupId = membership.groupId;
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new UnauthorizedException(
          'You are not authorized to access this membership',
        );
      }
    }

    // Regular group membership check
    if (!groupId) {
      throw new NotFoundException('Group ID not provided');
    }

    try {
      // Check if user is a member of the group
      const membership = await this.prisma.membership.findUnique({
        where: {
          groupMembership: {
            groupId: groupId,
            userId: user.id,
          },
        },
      });

      if (!membership) {
        throw new UnauthorizedException('You are not a member of this group');
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        'You are not authorized to access this group',
      );
    }
  }
}
