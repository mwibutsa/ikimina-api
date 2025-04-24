import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinGroupDto {
  @ApiProperty({ description: 'Group invitation code', example: 'abc123' })
  @IsString()
  @IsNotEmpty({ message: 'Invitation code is required' })
  invitationCode: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+250700000000',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
