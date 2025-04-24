import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminShuffleDto {
  @ApiProperty({
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Group ID is required' })
  groupId: string;

  @ApiProperty({ description: 'Admin code', example: 'ADMIN123' })
  @IsString()
  @IsNotEmpty({ message: 'Admin code is required' })
  adminCode: string;
}
