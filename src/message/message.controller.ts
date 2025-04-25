import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.messageService.createMessage(req.user.id, createMessageDto);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all messages for a group' })
  @ApiResponse({
    status: 200,
    description: 'Returns all messages for the group',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupMessages(@Param('groupId') groupId: string) {
    return this.messageService.getGroupMessages(groupId);
  }
}
