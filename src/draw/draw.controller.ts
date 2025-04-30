import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { DrawService } from './draw.service';
import { DrawPositionDto } from './dto/draw-position.dto';
import { AdminShuffleDto } from './dto/admin-shuffle.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from '../auth/guards/group-member.guard';

@ApiTags('Draws')
@Controller('draws')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post('position')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Draw a position for a member (requires membership)',
  })
  @ApiResponse({ status: 201, description: 'Position drawn successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  drawPosition(@Body() drawPositionDto: DrawPositionDto) {
    return this.drawService.drawPosition(drawPositionDto);
  }

  @Post('admin-shuffle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Admin shuffle all positions in a group (requires creator authentication)',
  })
  @ApiResponse({ status: 201, description: 'Positions shuffled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  adminShuffle(@Body() adminShuffleDto: AdminShuffleDto) {
    return this.drawService.adminShuffle(adminShuffleDto);
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all draws for a group (requires membership)' })
  @ApiResponse({ status: 200, description: 'Returns all draws for the group' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupDraws(@Param('groupId') groupId: string) {
    return this.drawService.getGroupDraws(groupId);
  }

  @Get('membership/:membershipId')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the position for a member (requires membership)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the position for the member',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Member has not drawn a position' })
  getMemberPosition(@Param('membershipId') membershipId: string) {
    return this.drawService.getMemberPosition(membershipId);
  }
}
