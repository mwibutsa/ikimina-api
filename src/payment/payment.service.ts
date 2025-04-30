import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    // Verify membership exists
    const membership = await this.prisma.membership.findUnique({
      where: { id: createPaymentDto.membershipId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: createPaymentDto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Verify receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: createPaymentDto.receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        amount: createPaymentDto.amount,
        dueDate: new Date(createPaymentDto.dueDate),
        status: PaymentStatus.PENDING,
        membershipId: createPaymentDto.membershipId,
        groupId: createPaymentDto.groupId,
        receiverId: createPaymentDto.receiverId,
      },
      include: {
        membership: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        group: true,
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return payment;
  }

  async updatePaymentStatus(
    paymentId: string,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    // Check if payment exists
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: updatePaymentStatusDto.status,
        paidAt:
          updatePaymentStatusDto.status === PaymentStatus.PAID
            ? updatePaymentStatusDto.paidAt
              ? new Date(updatePaymentStatusDto.paidAt)
              : new Date()
            : null,
      },
      include: {
        membership: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        group: true,
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return updatedPayment;
  }

  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        membership: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        group: true,
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getGroupPayments(groupId: string) {
    return this.prisma.payment.findMany({
      where: { groupId },
      include: {
        membership: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getMembershipPayments(membershipId: string) {
    return this.prisma.payment.findMany({
      where: { membershipId },
      include: {
        group: true,
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async generatePaymentSchedule(groupId: string) {
    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        memberships: true,
        draws: {
          include: {
            membership: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if draws are completed
    if (group.draws.length < group.totalMembers) {
      throw new BadRequestException(
        'Cannot generate payment schedule until all positions are drawn',
      );
    }

    // Check if start date is in the past
    const startDate = new Date();

    // Delete any existing payments
    await this.prisma.payment.deleteMany({
      where: { groupId },
    });

    // Sort draws by position
    const sortedDraws = [...group.draws].sort(
      (a, b) => a.position - b.position,
    );

    // Generate payment schedule based on contribution period
    const payments: Payment[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < sortedDraws.length; i++) {
      const receiverMembership = sortedDraws[i].membership;

      // For each member, create a payment to each position holder
      for (const membership of group.memberships) {
        // Skip creating payment from receiver to themselves
        if (membership.id === receiverMembership.id) continue;

        const payment = await this.prisma.payment.create({
          data: {
            amount: group.contributionAmount,
            dueDate: new Date(currentDate),
            status: PaymentStatus.PENDING,
            membershipId: membership.id,
            groupId: group.id,
            receiverId: receiverMembership.userId,
          },
        });

        payments.push(payment);
      }

      // Increment date based on contribution period
      switch (group.contributionPeriod) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'BI_WEEKLY':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Update group with next payment date
    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        nextPaymentDate: new Date(startDate),
      },
    });

    return payments;
  }
}
