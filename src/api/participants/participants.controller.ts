import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Participant } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';
import { ActivitiesService } from '../activities/activities.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { FilterParticipantDto } from './dto/filter-participant.dto';
import { FilterParticipantHistoryDto } from './dto/filter-participant-history.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ParticipantsService } from './participants.service';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantsController {
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Participant' })
  @ApiResponse({ status: 201, description: 'Success Create Participant.' })
  @ApiResponse({ status: 400, description: 'Failed Create Participant.' })
  async create(
    @Body() createParticipantDto: CreateParticipantDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant>> {
    const ctx: string = 'Create Participant';
    const result = await this.participantsService.create(createParticipantDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Insert Many Participants' })
  @ApiResponse({
    status: 201,
    description: 'Success Insert Many Participants.',
  })
  @ApiResponse({ status: 400, description: 'Failed Insert Many Participants.' })
  async insertMany(
    @Query() query: FilterParticipantDto,
    @Body() createParticipantDto: CreateParticipantDto[],
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant[]>> {
    const ctx: string = 'Insert Many Participants';
    const authUser = request.user;
    const activity = await this.activitiesService.findOne(query.activityId);
    if (!activity) {
      response.status(404);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Activity With ID: ${query.activityId} Not Found`,
        404,
        false,
      );
    }
    const checkTokenUser = await this.subscriptionsService.findOneByUser(
      authUser.id,
    );
    const tokenPerUser = !activity.tokenPerUser ? 0 : activity.tokenPerUser;
    const userToken = !checkTokenUser.amount ? 0 : checkTokenUser.amount;
    const tokenNeeded = tokenPerUser * createParticipantDto.length;
    if (userToken < tokenNeeded) {
      response.status(409);
      return new BaseResponse(
        null,
        `Failed ${ctx}. User Token Not Enough`,
        409,
        false,
      );
    }
    const result = await this.participantsService.insertMany(
      query,
      createParticipantDto,
    );
    if (result.length === 0) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/invite')
  @ApiOperation({ summary: 'Invite One Participant' })
  @ApiResponse({
    status: 201,
    description: 'Success Invite One Participant.',
  })
  @ApiResponse({ status: 400, description: 'Failed Invite One Participant.' })
  async inviteOne(
    @Body() updateParticipantDto: UpdateParticipantDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant>> {
    const ctx: string = 'Invite One Participant';
    const result =
      await this.participantsService.inviteOne(updateParticipantDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Participant' })
  @ApiResponse({ status: 200, description: 'Success Find All Participant.' })
  @ApiResponse({ status: 404, description: 'Failed Find All Participant.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant[]>> {
    const ctx: string = 'Get All Participant';
    const result = await this.participantsService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get('test-history')
  @ApiOperation({ summary: 'Find All Participant Test History' })
  @ApiResponse({
    status: 200,
    description: 'Success Find All Participant Test History.',
  })
  @ApiResponse({
    status: 404,
    description: 'Failed Find All Participant Test History.',
  })
  async findMyTestHistory(
    @Query() query: FilterParticipantHistoryDto,
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant[]>> {
    const ctx: string = 'Get All Participant Test History';
    const authUser = request.user;
    const participantId = authUser.id;
    const activityId = authUser.activityId;
    const result = await this.participantsService.findMyTestHistory(
      query,
      participantId,
      activityId,
    );
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find One Participant' })
  @ApiResponse({ status: 200, description: 'Success Find One Participant.' })
  @ApiResponse({ status: 404, description: 'Failed Find One Participant.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant>> {
    const ctx: string = `Get One Participant ID: ${id}`;
    const result = await this.participantsService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One Participant' })
  @ApiResponse({ status: 200, description: 'Success Update One Participant.' })
  @ApiResponse({ status: 400, description: 'Failed Update One Participant.' })
  async update(
    @Param('id') id: number,
    @Body() updateParticipantDto: UpdateParticipantDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant>> {
    const ctx: string = `Update One Participant ID: ${id}`;
    const participant = await this.participantsService.findOne(id);
    if (!participant) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.participantsService.update(
      participant,
      updateParticipantDto,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One Participant' })
  @ApiResponse({ status: 200, description: 'Success Remove One Participant.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One Participant.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Participant>> {
    const ctx: string = `Delete One Participant ID: ${id}`;
    const participant = await this.participantsService.findOne(id);
    if (!participant) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.participantsService.remove(participant);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }
}
