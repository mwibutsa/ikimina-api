import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { GroupService } from '../../group/group.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
  params: {
    id?: string;
    groupId?: string;
  };
}

@Injectable()
export class GroupCreatorGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const groupId = request.params.id || request.params.groupId;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!groupId) {
      throw new NotFoundException('Group ID not provided');
    }

    try {
      const group = await this.groupService.getGroupById(groupId);

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      // Check if the authenticated user is the creator of the group
      return group.creator.id === user.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException(
        'You are not authorized to access this group',
      );
    }
  }
}
