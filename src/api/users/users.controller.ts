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

import { User } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'Success Create User.' })
  @ApiResponse({ status: 400, description: 'Failed Create User.' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = 'Create User';
    const result = await this.usersService.create(createUserDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Post('/invite')
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'Success Create User.' })
  @ApiResponse({ status: 400, description: 'Failed Create User.' })
  async createInvite(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = 'Create User';
    const result = await this.usersService.createInvite(createUserDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }
  @Get()
  @ApiOperation({ summary: 'Find All User' })
  @ApiResponse({ status: 200, description: 'Success Find All User.' })
  @ApiResponse({ status: 404, description: 'Failed Find All User.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User[]>> {
    const ctx: string = 'Get All User';
    const result = await this.usersService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Find One User Profile' })
  @ApiResponse({ status: 200, description: 'Success Find One User Profile.' })
  @ApiResponse({ status: 404, description: 'Failed Find One User Profile.' })
  async findProfile(
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const user = request.user;
    const ctx: string = `Get One User Profile ID: ${user.id}`;
    const result = await this.usersService.findOne(user.id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find One User' })
  @ApiResponse({ status: 200, description: 'Success Find One User.' })
  @ApiResponse({ status: 404, description: 'Failed Find One User.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = `Get One User ID: ${id}`;
    const result = await this.usersService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One User' })
  @ApiResponse({ status: 200, description: 'Success Update One User.' })
  @ApiResponse({ status: 400, description: 'Failed Update One User.' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = `Update One User ID: ${id}`;
    const user = await this.usersService.findOne(id);
    if (!user) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.usersService.update(user, updateUserDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One User' })
  @ApiResponse({ status: 200, description: 'Success Remove One User.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One User.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = `Delete One User ID: ${id}`;
    const user = await this.usersService.findOne(id);
    if (!user) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.usersService.remove(user);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }
}
