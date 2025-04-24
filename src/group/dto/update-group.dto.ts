import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ContributionPeriod } from '@prisma/client';

export class UpdateGroupDto {
  @ApiProperty({
    description: 'Group name',
    example: 'My Ikimina Group',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Contribution period',
    enum: ContributionPeriod,
    example: ContributionPeriod.MONTHLY,
    required: false,
  })
  @IsEnum(ContributionPeriod)
  @IsOptional()
  contributionPeriod?: ContributionPeriod;

  @ApiProperty({
    description: 'Contribution amount',
    example: 10000,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  contributionAmount?: number;

  @ApiProperty({
    description: 'Contribution currency',
    example: 'RWF',
    required: false,
  })
  @IsString()
  @IsOptional()
  contributionCurrency?: string;

  @ApiProperty({
    description: 'Total members in the group',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalMembers?: number;
}
