import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { DrawService } from './draw.service';
import { DrawPositionDto } from './dto/draw-position.dto';
import { AdminShuffleDto } from './dto/admin-shuffle.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiTags('Draws')
@Controller('draws')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post('position')
  @ApiOperation({ summary: 'Draw a position for a member' })
  @ApiResponse({ status: 201, description: 'Position drawn successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  drawPosition(
    @Body() drawPositionDto: DrawPositionDto,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    return this.drawService.drawPosition(drawPositionDto, clientIp);
  }

  @Post('admin-shuffle')
  @ApiOperation({ summary: 'Admin shuffle all positions in a group' })
  @ApiResponse({ status: 201, description: 'Positions shuffled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  adminShuffle(@Body() adminShuffleDto: AdminShuffleDto) {
    return this.drawService.adminShuffle(adminShuffleDto);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all draws for a group' })
  @ApiResponse({ status: 200, description: 'Returns all draws for the group' })
  getGroupDraws(@Param('groupId') groupId: string) {
    return this.drawService.getGroupDraws(groupId);
  }

  @Get('membership/:membershipId')
  @ApiOperation({ summary: 'Get the position for a member' })
  @ApiResponse({
    status: 200,
    description: 'Returns the position for the member',
  })
  @ApiResponse({ status: 404, description: 'Member has not drawn a position' })
  getMemberPosition(@Param('membershipId') membershipId: string) {
    return this.drawService.getMemberPosition(membershipId);
  }
}
