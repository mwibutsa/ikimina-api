import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JoinGroupDto } from './dto/join-group.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from '../auth/guards/group-member.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Memberships')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a group using invitation code' })
  @ApiResponse({ status: 201, description: 'Successfully joined the group' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  joinGroup(
    @CurrentUser('id') userId: string,
    @Body() joinGroupDto: JoinGroupDto,
  ) {
    return this.membershipService.joinGroup(joinGroupDto, userId);
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all members of a group (requires creator authentication)',
  })
  @ApiResponse({ status: 200, description: 'Returns all group members' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupMembers(@Param('groupId') groupId: string) {
    return this.membershipService.getGroupMembers(groupId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all groups that a user is a member of' })
  @ApiResponse({ status: 200, description: 'Returns all user memberships' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserMemberships(@CurrentUser('id') userId: string) {
    return this.membershipService.getUserMemberships(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get a specific membership by id (requires membership in the group)',
  })
  @ApiResponse({ status: 200, description: 'Returns the membership' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  getMembership(@Param('id') id: string) {
    return this.membershipService.getMembershipById(id);
  }
}
