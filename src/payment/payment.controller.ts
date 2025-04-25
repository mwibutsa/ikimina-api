import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update payment status' })
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
  @ApiOperation({ summary: 'Get a payment by id' })
  @ApiResponse({ status: 200, description: 'Returns the payment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all payments for a group' })
  @ApiResponse({
    status: 200,
    description: 'Returns all payments for the group',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getGroupPayments(@Param('groupId') groupId: string) {
    return this.paymentService.getGroupPayments(groupId);
  }

  @Get('membership/:membershipId')
  @ApiOperation({ summary: 'Get all payments for a membership' })
  @ApiResponse({
    status: 200,
    description: 'Returns all payments for the membership',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMembershipPayments(@Param('membershipId') membershipId: string) {
    return this.paymentService.getMembershipPayments(membershipId);
  }

  @Post('schedule/:groupId')
  @ApiOperation({ summary: 'Generate payment schedule for a group' })
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
