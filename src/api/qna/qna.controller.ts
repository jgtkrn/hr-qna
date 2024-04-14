import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Qna } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';

import { CreateQnaDto } from './dto/create-qna.dto';
import { InsertAnswerDto } from './dto/insert-answer.dto';
import { UpdateQnaDto } from './dto/update-qna.dto';
import { QnaService } from './qna.service';

@ApiTags('QnA')
@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  @Post()
  @ApiOperation({ summary: 'Create QnA' })
  @ApiResponse({ status: 201, description: 'Success Create QnA.' })
  @ApiResponse({ status: 400, description: 'Failed Create QnA.' })
  async create(
    @Body() createQnaDto: CreateQnaDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna>> {
    const ctx: string = 'Create QnA';
    const result = await this.qnaService.create(createQnaDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/insert-answer')
  @ApiOperation({ summary: 'Insert Answer' })
  @ApiResponse({ status: 201, description: 'Success Insert Answer.' })
  @ApiResponse({ status: 400, description: 'Failed Insert Answer.' })
  async insertHistoryAnswer(
    @Body() insertAnswerDto: InsertAnswerDto,
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna>> {
    const ctx: string = 'Insert Answer';
    const authUser = request.user;
    if (!authUser.activityId) {
      response.status(401);
      return new BaseResponse(
        null,
        `Failed ${ctx}. You Are Not Participant.`,
        401,
        false,
      );
    }
    const result = await this.qnaService.insertHistoryAnswer(
      insertAnswerDto,
      authUser.id,
      authUser.activityId,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Insert Many QnA' })
  @ApiResponse({ status: 201, description: 'Success Insert Many QnA.' })
  @ApiResponse({ status: 400, description: 'Failed Insert Many QnA.' })
  async insertMany(
    @Body() createQnaDto: CreateQnaDto[],
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna[]>> {
    const ctx: string = 'Insert Many QnA';
    const result = await this.qnaService.insertMany(createQnaDto);
    if (result.length === 0) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All QnA' })
  @ApiResponse({ status: 200, description: 'Success Find All QnA.' })
  @ApiResponse({ status: 404, description: 'Failed Find All QnA.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna[]>> {
    const ctx: string = 'Get All QnA';
    const result = await this.qnaService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get('/test/:id')
  @ApiOperation({ summary: 'Find All QnA by Test Id' })
  @ApiResponse({ status: 200, description: 'Success Find All QnA by Test Id.' })
  @ApiResponse({ status: 404, description: 'Failed Find All QnA by Test Id.' })
  async findByTestId(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna[]>> {
    const ctx: string = 'Get All QnA by Test Id';
    const result = await this.qnaService.findByTestId(id);
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One QnA' })
  @ApiResponse({ status: 200, description: 'Success Find One QnA.' })
  @ApiResponse({ status: 404, description: 'Failed Find One QnA.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna>> {
    const ctx: string = `Get One QnA ID: ${id}`;
    const result = await this.qnaService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One QnA' })
  @ApiResponse({ status: 200, description: 'Success Update One QnA.' })
  @ApiResponse({ status: 400, description: 'Failed Update One QnA.' })
  async update(
    @Param('id') id: number,
    @Body() updateQnaDto: UpdateQnaDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna>> {
    const ctx: string = `Update One QnA ID: ${id}`;
    const qna = await this.qnaService.findOne(id);
    if (!qna) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.qnaService.update(qna, updateQnaDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One QnA' })
  @ApiResponse({ status: 200, description: 'Success Remove One QnA.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One QnA.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Qna>> {
    const ctx: string = `Delete One QnA ID: ${id}`;
    const qna = await this.qnaService.findOne(id);
    if (!qna) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.qnaService.remove(qna);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }
}
