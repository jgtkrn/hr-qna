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

import { SubscriptionHistory } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';
import {
  Action,
  CaslAbilityFactory,
} from '../../utils/casl/casl-ability-factory';
import { CreateSubscriptionDto } from '../subscriptions/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../subscriptions/dto/update-subscription.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

import { ApproveSubscriptionHistoryDto } from './dto/approve-subscription-history.dto';
import { CreateSubscriptionHistoryDto } from './dto/create-subscription-history.dto';
import { UpdateSubscriptionHistoryDto } from './dto/update-subscription-history.dto';
import { SubscriptionHistoryService } from './subscription-history.service';

@ApiTags('SubscriptionHistory')
@Controller('subscription-history')
export class SubscriptionHistoryController {
  constructor(
    private readonly subscriptionHistoryService: SubscriptionHistoryService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Subscription History' })
  @ApiResponse({
    status: 201,
    description: 'Success Create Subscription History.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Create Subscription History.',
  })
  async create(
    @Body() createSubscriptionHistoryDto: CreateSubscriptionHistoryDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory>> {
    const ctx: string = 'Create Subscription History';
    const user = request.user;
    createSubscriptionHistoryDto.userId = user.id;
    createSubscriptionHistoryDto.status = 'PENDING';
    const result = await this.subscriptionHistoryService.create(
      createSubscriptionHistoryDto,
    );
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Subscription History' })
  @ApiResponse({
    status: 200,
    description: 'Success Find All Subscription History.',
  })
  @ApiResponse({
    status: 404,
    description: 'Failed Find All Subscription History.',
  })
  async findAll(
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory[]>> {
    const ctx: string = 'Get All Subscription History';
    const user = request.user;
    const ability = this.caslAbilityFactory.subscriptionHistory(user);
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionHistoryService.findAll();
      if (result.length === 0) {
        response.status(404);
        return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
      }
      response.status(200);
      return new BaseResponse(result, `Success ${ctx}.`, 200, true);
    }
    response.status(401);
    return new BaseResponse([], `Failed ${ctx}.`, 401, false);
  }

  @Get('/user')
  @ApiOperation({ summary: 'Find All Subscription History By User' })
  @ApiResponse({
    status: 200,
    description: 'Success Find All Subscription History By User.',
  })
  @ApiResponse({
    status: 404,
    description: 'Failed Find All Subscription History By User.',
  })
  async findAllByUser(
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory[]>> {
    const ctx: string = 'Get All Subscription History By User';
    const user = request.user;
    const result = await this.subscriptionHistoryService.findAllByUser(user);
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or Cancel One Subscription History' })
  @ApiResponse({
    status: 200,
    description: 'Success Approve or Cancel One Subscription History.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Approve or Cancel One Subscription History.',
  })
  async status(
    @Param('id') id: number,
    @Body() approveSubscriptionHistoryDto: ApproveSubscriptionHistoryDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory>> {
    const ctx: string = `Approve or Cancel One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscriptionHistory(user);
    const subscriptionHistory =
      await this.subscriptionHistoryService.findOne(id);
    if (!subscriptionHistory) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const currentStatus = subscriptionHistory.status;
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionHistoryService.update(
        subscriptionHistory,
        approveSubscriptionHistoryDto,
      );
      if (!result) {
        response.status(400);
        return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
      }
      if (currentStatus == 'PENDING' && result.status == 'APPROVED') {
        const currentSubs = await this.subscriptionsService.findOneByUser(
          result.userId,
        );
        if (!currentSubs) {
          const createSubs = new CreateSubscriptionDto();
          createSubs.amount = result.amount;
          createSubs.isActive = result.isActive;
          createSubs.userId = result.userId;
          await this.subscriptionsService.create(createSubs);
        } else {
          const updateSubs = new UpdateSubscriptionDto();
          updateSubs.amount = currentSubs.amount + result.amount;
          await this.subscriptionsService.update(currentSubs, updateSubs);
        }
      }
      response.status(200);
      return new BaseResponse(result, `Success ${ctx}.`, 200, true);
    }
    response.status(401);
    return new BaseResponse(null, `Failed ${ctx}.`, 401, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Subscription History' })
  @ApiResponse({
    status: 200,
    description: 'Success Find One Subscription History.',
  })
  @ApiResponse({
    status: 404,
    description: 'Failed Find One Subscription History.',
  })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory>> {
    const ctx: string = `Get One Subscription History ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscriptionHistory(user);
    const result = await this.subscriptionHistoryService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    if (
      ability.can(Action.Manage, result) ||
      ability.can(Action.Manage, 'all')
    ) {
      response.status(200);
      return new BaseResponse(result, `Success ${ctx}.`, 200, true);
    }
    response.status(401);
    return new BaseResponse(null, `Failed ${ctx}.`, 401, false);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One Subscription History' })
  @ApiResponse({
    status: 200,
    description: 'Success Update One Subscription History.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Update One Subscription History.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateSubscriptionHistoryDto: UpdateSubscriptionHistoryDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory>> {
    const ctx: string = `Update One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscriptionHistory(user);
    const subscriptionHistory =
      await this.subscriptionHistoryService.findOne(id);
    if (!subscriptionHistory) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionHistoryService.update(
        subscriptionHistory,
        updateSubscriptionHistoryDto,
      );
      if (!result) {
        response.status(400);
        return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
      }
      response.status(200);
      return new BaseResponse(result, `Success ${ctx}.`, 200, true);
    }
    response.status(401);
    return new BaseResponse(null, `Failed ${ctx}.`, 401, false);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One Subscription History' })
  @ApiResponse({
    status: 200,
    description: 'Success Remove One Subscription History.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed Remove One Subscription History.',
  })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<SubscriptionHistory>> {
    const ctx: string = `Delete One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscriptionHistory(user);
    const subscriptionHistory =
      await this.subscriptionHistoryService.findOne(id);
    if (!subscriptionHistory) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    if (ability.can(Action.Manage, 'all')) {
      const result =
        await this.subscriptionHistoryService.remove(subscriptionHistory);
      if (result) {
        response.status(400);
        return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
      }
      response.status(200);
      return new BaseResponse(result, `Success ${ctx}.`, 200, true);
    }
    response.status(401);
    return new BaseResponse(null, `Failed ${ctx}.`, 401, false);
  }
}
