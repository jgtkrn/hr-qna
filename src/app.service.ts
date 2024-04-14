import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getServerResponse(): Promise<any> {
    try {
      return 'This Service Running Properly.';
    } catch {
      return null;
    }
  }
}
