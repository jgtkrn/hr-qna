import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseResponse<T> {
  public data: T | null;
  public message: string;
  public code: number;
  public success: boolean;

  constructor(
    data: T | null = null,
    message: string = '',
    code: number = 200,
    success: boolean = true,
  ) {
    this.data = data;
    this.message = message;
    this.code = code;
    this.success = success;
  }
}

@Injectable()
export class PaginatedResponse<T> extends BaseResponse<T> {
  public meta: Meta;
  constructor(
    data: T | null = null,
    message: string = '',
    code: number = 200,
    success: boolean = true,
    meta: Meta,
  ) {
    super(data, message, code, success);
    this.meta = meta;
  }
}

interface Meta {
  page: number;
  size: number;
}
