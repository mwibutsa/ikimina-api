import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGroupDto {
  @ApiProperty({ description: 'Group invitation code', example: 'abc123' })
  @IsString()
  @IsNotEmpty({ message: 'Invitation code is required' })
  invitationCode: string;
}
