import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Test } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestsService } from './tests.service';

@ApiTags('Test')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Test' })
  @ApiResponse({ status: 201, description: 'Success Create Test.' })
  @ApiResponse({ status: 400, description: 'Failed Create Test.' })
  async create(
    @Body() createTestDto: CreateTestDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Test>> {
    const ctx: string = 'Create Test';
    const result = await this.testsService.create(createTestDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Test' })
  @ApiResponse({ status: 200, description: 'Success Find All Test.' })
  @ApiResponse({ status: 404, description: 'Failed Find All Test.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Test[]>> {
    const ctx: string = 'Get All Test';
    const result = await this.testsService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Test' })
  @ApiResponse({ status: 200, description: 'Success Find One Test.' })
  @ApiResponse({ status: 404, description: 'Failed Find One Test.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Test>> {
    const ctx: string = `Get One Test ID: ${id}`;
    const result = await this.testsService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One Test' })
  @ApiResponse({ status: 200, description: 'Success Update One Test.' })
  @ApiResponse({ status: 400, description: 'Failed Update One Test.' })
  async update(
    @Param('id') id: number,
    @Body() updateTestDto: UpdateTestDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Test>> {
    const ctx: string = `Update One Test ID: ${id}`;
    const test = await this.testsService.findOne(id);
    if (!test) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.testsService.update(test, updateTestDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One Test' })
  @ApiResponse({ status: 200, description: 'Success Remove One Test.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One Test.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Test>> {
    const ctx: string = `Delete One Test ID: ${id}`;
    const test = await this.testsService.findOne(id);
    if (!test) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.testsService.remove(test);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }
}
