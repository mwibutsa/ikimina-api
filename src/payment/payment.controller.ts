import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupMemberGuard } from '../auth/guards/group-member.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment (requires membership)' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update payment status (requires creator authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.updatePaymentStatus(id, updatePaymentStatusDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a payment by id (requires membership)' })
  @ApiResponse({ status: 200, description: 'Returns the payment' })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all payments for a group (requires membership)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all payments for the group',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupPayments(@Param('groupId') groupId: string) {
    return this.paymentService.getGroupPayments(groupId);
  }

  @Get('membership/:membershipId')
  @UseGuards(JwtAuthGuard, GroupMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all payments for a membership (requires membership)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all payments for the membership',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized or not a member' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  getMembershipPayments(@Param('membershipId') membershipId: string) {
    return this.paymentService.getMembershipPayments(membershipId);
  }

  @Post('schedule/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Generate payment schedule for a group (requires creator authentication)',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment schedule generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  generatePaymentSchedule(@Param('groupId') groupId: string) {
    return this.paymentService.generatePaymentSchedule(groupId);
  }
}
