import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from '../auth/guards/group-member.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new message (requires membership)' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.messageService.createMessage(userId, createMessageDto);
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all messages for a group (requires membership)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all messages for the group',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupMessages(@Param('groupId') groupId: string) {
    return this.messageService.getGroupMessages(groupId);
  }
}
