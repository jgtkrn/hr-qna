import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseResponse } from './abstracts/base-response';
import { AppService } from './app.service';

@Controller()
@ApiTags('Base')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @ApiOperation({ summary: 'Get Service Response' })
  @ApiResponse({ status: 200, description: 'Success Get Service Response.' })
  @ApiResponse({ status: 500, description: 'Failed Get Service Response.' })
  async getServerResponse(): Promise<BaseResponse<any>> {
    const result = await this.appService.getServerResponse();
    if (!result) {
      return await new BaseResponse(null, `${result}`, 500, false);
    }
    return await new BaseResponse(null, `${result}`, 200, true);
  }
}
