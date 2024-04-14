import { Injectable } from '@nestjs/common';

@Injectable()
export class TextGenService {
  async randomString(length: number = 32) {
    let result = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let len = 0;
    while (len < length) {
      result += chars[Math.floor(Math.random() * charsLength)];
      len += 1;
    }
    return result;
  }

  async getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = `${year}${month}${day}`;
    return result;
  }
}
