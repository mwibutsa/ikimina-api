import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateGroupDto } from './createGroup.dto';
import { Type } from 'class-transformer';

export class CreateUserGroupDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+250700000000',
    required: false,
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({ description: 'Group information' })
  @ValidateNested()
  @Type(() => CreateGroupDto)
  group: CreateGroupDto;
}
