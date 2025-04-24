import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello everyone! The next contribution date is approaching.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  content: string;

  @ApiProperty({
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Group ID is required' })
  groupId: string;
}
