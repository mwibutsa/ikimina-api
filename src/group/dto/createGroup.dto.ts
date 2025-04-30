import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { DrawMode, ContributionPeriod, Prisma } from '@prisma/client';

export class CreateGroupDto implements Partial<Prisma.GroupCreateInput> {
  @ApiProperty({ description: 'Group name', example: 'My Ikimina Group' })
  @IsString()
  @IsNotEmpty({ message: 'Group name is required' })
  name: string;

  @ApiProperty({
    description: 'Draw mode',
    enum: DrawMode,
    example: DrawMode.SELF_DRAW,
  })
  @IsEnum(DrawMode)
  @IsNotEmpty({ message: 'Draw mode is required' })
  drawMode: DrawMode;

  @ApiProperty({
    description: 'Contribution period',
    enum: ContributionPeriod,
    example: ContributionPeriod.MONTHLY,
  })
  @IsEnum(ContributionPeriod)
  @IsNotEmpty({ message: 'Contribution period is required' })
  contributionPeriod: ContributionPeriod;

  @ApiProperty({
    description: 'Contribution amount',
    example: 10000,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Contribution amount is required' })
  contributionAmount: number;

  @ApiProperty({
    description: 'Contribution currency',
    example: 'RWF',
  })
  @IsString()
  @IsNotEmpty({ message: 'Contribution currency is required' })
  contributionCurrency: string;

  @ApiProperty({
    description: 'Group start date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsString()
  @IsNotEmpty({ message: 'Group start date is required' })
  groupStartDate: Date;

  @ApiProperty({
    description: 'Total members in the group',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalMembers?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  membersPerRound?: number;
}
