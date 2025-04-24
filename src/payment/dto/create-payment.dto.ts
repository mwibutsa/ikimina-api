import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Amount of the payment', example: 10000 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Payment amount is required' })
  amount: number;

  @ApiProperty({
    description: 'Due date of the payment',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate: string;

  @ApiProperty({
    description: 'Membership ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Membership ID is required' })
  membershipId: string;

  @ApiProperty({
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Group ID is required' })
  groupId: string;

  @ApiProperty({
    description: 'Receiver ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Receiver ID is required' })
  receiverId: string;
}
