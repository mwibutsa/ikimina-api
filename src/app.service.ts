import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, string> {
    return {
      data: 'Hello World!',
      DB_URL: process.env.DATABASE_URL as string,
    };
  }
}
