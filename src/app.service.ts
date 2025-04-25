import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): Record<string, string> {
    return {
      data: 'Hello World!',
      DB_URL: this.configService.get<string>('DATABASE_URL') as string,
    };
  }
}
