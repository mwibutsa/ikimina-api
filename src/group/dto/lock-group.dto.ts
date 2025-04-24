import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LockGroupDto {
  @ApiProperty({ description: 'Admin code for the group', example: 'ADMIN123' })
  @IsString()
  @IsNotEmpty({ message: 'Admin code is required' })
  adminCode: string;
}
