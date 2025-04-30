import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from '../auth/guards/group-member.guard';
import { CreateGroupDto } from './dto/createGroup.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createGroup(
    @Body() groupData: CreateGroupDto,
    @CurrentUser('id') userId: string,
  ) {
    // Create the group
    const group = await this.groupService.createGroup(userId, groupData);

    return group;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a group by id (requires membership)' })
  @ApiResponse({ status: 200, description: 'Returns group details' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroup(@Param('id') id: string) {
    return this.groupService.getGroupById(id);
  }

  @Get('invitation/:code')
  @ApiOperation({ summary: 'Get a group by invitation code' })
  @ApiResponse({ status: 200, description: 'Returns group details' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupByInvitationCode(@Param('code') code: string) {
    return this.groupService.getGroupByInvitationCode(code);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a group (requires creator authentication)' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.updateGroup(id, updateGroupDto);
  }

  @Put(':id/lock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lock a group (requires creator authentication)' })
  @ApiResponse({ status: 200, description: 'Group locked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  lockGroup(@Param('id') id: string) {
    return this.groupService.lockGroup(id);
  }

  @Get('find/phone')
  @ApiOperation({ summary: 'Find groups by phone number' })
  @ApiResponse({
    status: 200,
    description: 'Returns groups associated with phone number',
  })
  findGroupsByPhone(@Query('phoneNumber') phoneNumber: string) {
    return this.groupService.findGroupsByPhone(phoneNumber);
  }
}
