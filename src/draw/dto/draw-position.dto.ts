import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DrawPositionDto {
  @ApiProperty({
    description: 'Membership ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Membership ID is required' })
  membershipId: string;
}
