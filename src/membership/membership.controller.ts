import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Headers,
  Query,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Memberships')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('join')
  @ApiOperation({ summary: 'Join a group using invitation code' })
  @ApiResponse({ status: 201, description: 'Successfully joined the group' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  joinGroup(
    @Body() joinGroupDto: JoinGroupDto,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    return this.membershipService.joinGroup(joinGroupDto, clientIp);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all members of a group' })
  @ApiResponse({ status: 200, description: 'Returns all group members' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid admin code)' })
  @ApiHeader({
    name: 'Admin-Code',
    required: false,
    description: 'Optional admin code for more detailed information',
  })
  getGroupMembers(
    @Param('groupId') groupId: string,
    @Headers('admin-code') adminCode?: string,
  ) {
    return this.membershipService.getGroupMembers(groupId, adminCode);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get all groups that a user is a member of' })
  @ApiResponse({ status: 200, description: 'Returns all user memberships' })
  getUserMemberships(@Query('identifier') identifier: string) {
    return this.membershipService.getUserMemberships(identifier);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific membership by id' })
  @ApiResponse({ status: 200, description: 'Returns the membership' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  getMembership(@Param('id') id: string) {
    return this.membershipService.getMembershipById(id);
  }
}
