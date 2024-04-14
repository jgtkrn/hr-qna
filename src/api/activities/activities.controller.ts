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

import { Activity } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';
import { FilterParticipantDto } from '../participants/dto/filter-participant.dto';
import { ParticipantsService } from '../participants/participants.service';
import { UpdateSubscriptionDto } from '../subscriptions/dto/update-subscription.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { TestsService } from '../tests/tests.service';
import { UsersService } from '../users/users.service';

import { AssignComponentsDto } from './dto/assign-components.dto';
import { AssignTestsDto } from './dto/assign-tests.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ReOrderTestsDto } from './dto/reorder-tests.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivitiesService } from './activities.service';

@ApiTags('Activity')
@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly participantsService: ParticipantsService,
    private readonly testsService: TestsService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Activity' })
  @ApiResponse({ status: 201, description: 'Success Create Activity.' })
  @ApiResponse({ status: 400, description: 'Failed Create Activity.' })
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = 'Create Activity';
    const authUser = request.user;
    const user = await this.usersService.findOne(authUser.id);
    if (!user) {
      response.status(409);
      return new BaseResponse(null, `Failed ${ctx}. User Invalid`, 409, false);
    }
    const activity = await this.activitiesService.create(createActivityDto);
    if (!activity) {
      response.status(400);
      return new BaseResponse(null, `Failed ${ctx}.`, 400, false);
    }
    const result = await this.activitiesService.assignUser(user, activity);
    if (!result) {
      response.status(202);
      return new BaseResponse(
        activity,
        `Success ${ctx}. But User Not Assigned.`,
        202,
        true,
      );
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Activity' })
  @ApiResponse({ status: 200, description: 'Success Find All Activity.' })
  @ApiResponse({ status: 404, description: 'Failed Find All Activity.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any[]>> {
    const ctx: string = 'Get All Activity';
    const result = await this.activitiesService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Activity' })
  @ApiResponse({ status: 200, description: 'Success Find One Activity.' })
  @ApiResponse({ status: 404, description: 'Failed Find One Activity.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = `Get One Activity ID: ${id}`;
    const result = await this.activitiesService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get Activity Summary' })
  @ApiResponse({ status: 200, description: 'Success Find Activity Summary.' })
  @ApiResponse({ status: 404, description: 'Failed Find Activity Summary.' })
  async findSummary(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = `Get Activity Summary ID: ${id}`;
    const result = await this.activitiesService.findSummary(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One Activity' })
  @ApiResponse({ status: 200, description: 'Success Update One Activity.' })
  @ApiResponse({ status: 400, description: 'Failed Update One Activity.' })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = `Update One Activity ID: ${id}`;
    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.activitiesService.update(
      activity,
      updateActivityDto,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One Activity' })
  @ApiResponse({ status: 200, description: 'Success Remove One Activity.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One Activity.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = `Delete One Activity ID: ${id}`;
    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.activitiesService.remove(activity);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id/assign-user/:userId')
  @ApiOperation({ summary: 'Assign Activity User' })
  @ApiResponse({ status: 201, description: 'Success Modify Activity User.' })
  @ApiResponse({ status: 400, description: 'Failed Modify Activity User.' })
  async assignUser(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Activity>> {
    const ctx: string = 'Assign Activity User';
    const user = await this.usersService.findOne(userId);
    if (!user) {
      response.status(404);
      return new BaseResponse(
        null,
        `Failed ${ctx}. User Not Found`,
        404,
        false,
      );
    }
    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.activitiesService.assignUser(user, activity);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Patch(':id/assign-tests')
  @ApiOperation({ summary: 'Assign Activity Test' })
  @ApiResponse({ status: 201, description: 'Success Modify Activity Test.' })
  @ApiResponse({ status: 400, description: 'Failed Modify Activity Test.' })
  async assignTests(
    @Param('id') id: number,
    @Body() payload: AssignTestsDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Assign Activity Test';

    const tests = await this.testsService.findAllByIds(payload.testIds);
    if (tests.length === 0) {
      response.status(404);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Tests Not Found.`,
        404,
        false,
      );
    }

    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const activityTests = [];
    for (let i: number = 0; i < tests.length; i++) {
      activityTests.push({
        order: i,
        testId: tests[i].id,
        testToken: tests[i].token ? tests[i].token : 0,
        activityId: id,
      });
    }
    const result = await this.activitiesService.assignTests(
      activity,
      activityTests,
      payload.testIds,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get(':id/assign-tests')
  @ApiOperation({ summary: 'Get Assigned Activity Test' })
  @ApiResponse({ status: 201, description: 'Success Modify Activity Test.' })
  @ApiResponse({ status: 400, description: 'Failed Modify Activity Test.' })
  async findTestsByActivity(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Get Assigned Activity Test';

    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }

    const result = await this.activitiesService.findTestsByActivity(activity);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id/tests-name')
  @ApiOperation({ summary: 'Get Assigned Activity Test Name' })
  @ApiResponse({
    status: 201,
    description: 'Success Get Assigned Activity Test Name.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Get Assigned Activity Test Name.',
  })
  async findTestsNameByActivity(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Get Assigned Activity Test Name';

    const activity = await this.activitiesService.findOne(id);
    if (!activity) {
      response.status(404);
      return new BaseResponse([], `Failed ${ctx}.`, 404, false);
    }

    const result = await this.activitiesService.testListPopUp(activity);
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id/participants-name')
  @ApiOperation({ summary: 'Get Assigned Participants Name' })
  @ApiResponse({
    status: 201,
    description: 'Success Get Assigned Participants Name.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Get Assigned Participants Name.',
  })
  async findParticipantsNameByActivity(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Get Assigned Participants Name';

    const results = await this.activitiesService.participantListPopUp(id);
    if (results.length === 0) {
      response.status(404);
      return new BaseResponse([], `Failed ${ctx}.`, 404, false);
    }

    response.status(200);
    return new BaseResponse(results, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id/reorder-tests')
  @ApiOperation({ summary: 'Reorder Activity Test' })
  @ApiResponse({ status: 201, description: 'Success Modify Activity Test.' })
  @ApiResponse({ status: 400, description: 'Failed Modify Activity Test.' })
  async reOrderTests(
    @Param('id') id: number,
    @Body() payload: ReOrderTestsDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Reorder Activity Test';

    const result = await this.activitiesService.reOrderTests(payload);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/assign-all')
  @ApiOperation({ summary: 'Assign Activity Components' })
  @ApiResponse({
    status: 201,
    description: 'Success Modify Activity Components.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Modify Activity Components.',
  })
  async assignAll(
    @Body() payload: AssignComponentsDto,
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<any>> {
    const ctx: string = 'Assign Activity Components';
    const authUser = request.user;
    const checkTokenUser = await this.subscriptionsService.findOneByUser(
      authUser.id,
    );
    const tests = await this.testsService.findAllByIds(payload.testIds);
    if (tests.length === 0) {
      response.status(404);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Tests Not Found.`,
        404,
        false,
      );
    }
    const activityPayload = new CreateActivityDto();
    activityPayload.name = payload.name ? payload.name : null;
    activityPayload.isActive = payload.isActive ? payload.isActive : null;
    activityPayload.startTime = payload.startTime ? payload.startTime : null;
    activityPayload.endTime = payload.endTime ? payload.endTime : null;
    activityPayload.description = payload.description
      ? payload.description
      : null;
    activityPayload.tokenPerUser = payload.tokenPerUser
      ? payload.tokenPerUser
      : null;
    activityPayload.tokenMax = payload.tokenMax ? payload.tokenMax : null;
    activityPayload.status = payload.status ? payload.status : null;
    activityPayload.isProctoring = payload.isProctoring
      ? payload.isProctoring
      : null;

    const activity = await this.activitiesService.create(activityPayload);
    if (!activity) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const activityTests = [];
    for (let i: number = 0; i < tests.length; i++) {
      activityTests.push({
        order: i,
        testId: tests[i].id,
        testToken: tests[i].token ? tests[i].token : 0,
        activityId: activity.id,
      });
    }
    const assignTests = await this.activitiesService.assignTests(
      activity,
      activityTests,
      payload.testIds,
    );
    if (!assignTests) {
      response.status(400);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Failed Assign Tests`,
        400,
        false,
      );
    }
    const newActivity = await this.activitiesService.findOne(activity.id);
    if (!newActivity) {
      response.status(400);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Failed Assign Participants`,
        400,
        false,
      );
    }
    const tokenPerUser = !newActivity.tokenPerUser
      ? 0
      : newActivity.tokenPerUser;
    const userToken = !checkTokenUser
      ? 0
      : !checkTokenUser.amount
      ? 0
      : checkTokenUser.amount;
    const tokenNeeded = tokenPerUser * payload.participants.length;
    if (userToken < tokenNeeded) {
      response.status(409);
      return new BaseResponse(
        null,
        `Failed ${ctx}. User Token Not Enough`,
        409,
        false,
      );
    }
    const updateSubscriptionDto = new UpdateSubscriptionDto();
    updateSubscriptionDto.amount = Number(userToken) - Number(tokenNeeded);
    const updateUserToken = await this.subscriptionsService.update(
      checkTokenUser,
      updateSubscriptionDto,
    );
    if (!updateUserToken) {
      response.status(409);
      return new BaseResponse(null, `Failed Update User Token`, 409, false);
    }
    const participantsFilter = new FilterParticipantDto();
    participantsFilter.activityId = activity.id;
    const assignParticipants = await this.participantsService.insertMany(
      participantsFilter,
      payload.participants,
    );
    if (!assignParticipants) {
      response.status(400);
      return new BaseResponse(
        null,
        `Failed ${ctx}. Failed Assign Participants`,
        400,
        false,
      );
    }
    const result = await this.activitiesService.findOneWithComponents(
      activity.id,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }
}
