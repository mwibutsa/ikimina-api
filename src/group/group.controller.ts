import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Headers,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { LockGroupDto } from './dto/lock-group.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group with user information' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  async createGroup(
    @Body() createUserGroupDto: CreateUserGroupDto,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    // First create or find the user
    let user: User | null = null;

    // If email is provided, try to find the user by email
    if (createUserGroupDto.email) {
      user = await this.userService.getUserByEmail(createUserGroupDto.email);
    }

    // If user not found, create a new user
    if (!user) {
      user = await this.userService.createUser({
        firstName: createUserGroupDto.firstName,
        lastName: createUserGroupDto.lastName,
        email: createUserGroupDto.email,
        phoneNumber: createUserGroupDto.phoneNumber,
        ipAddress: clientIp || '',
      });
    }

    // Then create the group
    return this.groupService.createGroup(user.id, createUserGroupDto.group);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by id' })
  @ApiResponse({ status: 200, description: 'Returns group details' })
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
  @ApiOperation({ summary: 'Update a group using admin code' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Headers('admin-code') adminCode: string,
  ) {
    return this.groupService.updateGroup(id, updateGroupDto, adminCode);
  }

  @Put(':id/lock')
  @ApiOperation({ summary: 'Lock a group' })
  @ApiResponse({ status: 200, description: 'Group locked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  lockGroup(@Param('id') id: string, @Body() lockGroupDto: LockGroupDto) {
    return this.groupService.lockGroup(id, lockGroupDto);
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
