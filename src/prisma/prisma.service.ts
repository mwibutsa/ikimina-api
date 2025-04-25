import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url:
            configService.get<string>('DATABASE_URL') ||
            'prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNTBhNTE2ODUtMzIwNS00NWEyLWExNWUtYTA2NjQ5OGU2MGMwIiwidGVuYW50X2lkIjoiZGE5OGI1ZmI5MzUyMWU4ZjJjZDA5ZjAyNGM3ZGJlMTA3ZDIxMDZkNjY3OTA0NTJmZmQwNzNmY2IyNTc3MmJiZiIsImludGVybmFsX3NlY3JldCI6ImJkYTJiNzU3LWEzMjUtNDA5MS05MmY1LWRhNzcwYTQxYjZmMSJ9.xQRZZxssPqdVzxcWB88nCkG4UHE6p8fsL36H_r7D2II',
        },
      },
    });
  }
}
