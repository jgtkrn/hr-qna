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

import { Subscription } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';
import {
  Action,
  CaslAbilityFactory,
} from '../../utils/casl/casl-ability-factory';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Subscription' })
  @ApiResponse({ status: 201, description: 'Success Create Subscription.' })
  @ApiResponse({ status: 400, description: 'Failed Create Subscription.' })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription>> {
    const ctx: string = 'Create Subscription';
    const user = request.user;
    createSubscriptionDto.userId = user.id;
    const ability = this.caslAbilityFactory.subscription(user);
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionsService.create(
        createSubscriptionDto,
      );
      if (!result) {
        response.status(400);
        return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
      }
      response.status(201);
      return new BaseResponse(result, `Success ${ctx}.`, 201, true);
    }
    response.status(401);
    return new BaseResponse(null, `Failed ${ctx}.`, 401, false);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Subscription' })
  @ApiResponse({ status: 200, description: 'Success Find All Subscription.' })
  @ApiResponse({ status: 404, description: 'Failed Find All Subscription.' })
  async findAll(
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription[]>> {
    const ctx: string = 'Get All Subscription';
    const user = request.user;
    const ability = this.caslAbilityFactory.subscription(user);
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionsService.findAll();
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
  @ApiOperation({ summary: 'Get One Subscription By User' })
  @ApiResponse({
    status: 200,
    description: 'Success Find One Subscription By User.',
  })
  @ApiResponse({
    status: 404,
    description: 'Failed Find One Subscription By User.',
  })
  async findOneByUser(
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription>> {
    const ctx: string = `Get One Subscription By User`;
    const user = request.user;
    const result = await this.subscriptionsService.findOneByUser(user.id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Subscription' })
  @ApiResponse({ status: 200, description: 'Success Find One Subscription.' })
  @ApiResponse({ status: 404, description: 'Failed Find One Subscription.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription>> {
    const ctx: string = `Get One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscription(user);
    const result = await this.subscriptionsService.findOne(id);
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
  @ApiOperation({ summary: 'Update One Subscription' })
  @ApiResponse({ status: 200, description: 'Success Update One Subscription.' })
  @ApiResponse({ status: 400, description: 'Failed Update One Subscription.' })
  async update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription>> {
    const ctx: string = `Update One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscription(user);
    const subscription = await this.subscriptionsService.findOne(id);
    if (!subscription) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionsService.update(
        subscription,
        updateSubscriptionDto,
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
  @ApiOperation({ summary: 'Remove One Subscription' })
  @ApiResponse({ status: 200, description: 'Success Remove One Subscription.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One Subscription.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
    @Req() request,
  ): Promise<BaseResponse<Subscription>> {
    const ctx: string = `Delete One Subscription ID: ${id}`;
    const user = request.user;
    const ability = this.caslAbilityFactory.subscription(user);
    const subscription = await this.subscriptionsService.findOne(id);
    if (!subscription) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    if (ability.can(Action.Manage, 'all')) {
      const result = await this.subscriptionsService.remove(subscription);
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
