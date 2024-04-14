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

import { Role } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Role' })
  @ApiResponse({ status: 201, description: 'Success Create Role.' })
  @ApiResponse({ status: 400, description: 'Failed Create Role.' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Role>> {
    const ctx: string = 'Create Role';
    const result = await this.rolesService.create(createRoleDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(201);
    return new BaseResponse(result, `Success ${ctx}.`, 201, true);
  }

  @Get()
  @ApiOperation({ summary: 'Find All Role' })
  @ApiResponse({ status: 200, description: 'Success Find All Role.' })
  @ApiResponse({ status: 404, description: 'Failed Find All Role.' })
  async findAll(
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Role[]>> {
    const ctx: string = 'Get All Role';
    const result = await this.rolesService.findAll();
    if (result.length === 0) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Role' })
  @ApiResponse({ status: 200, description: 'Success Find One Role.' })
  @ApiResponse({ status: 404, description: 'Failed Find One Role.' })
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Role>> {
    const ctx: string = `Get One Role ID: ${id}`;
    const result = await this.rolesService.findOne(id);
    if (!result) {
      response.status(404);
      return new BaseResponse(result, `Failed ${ctx}.`, 404, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update One Role' })
  @ApiResponse({ status: 200, description: 'Success Update One Role.' })
  @ApiResponse({ status: 400, description: 'Failed Update One Role.' })
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Role>> {
    const ctx: string = `Update One Role ID: ${id}`;
    const role = await this.rolesService.findOne(id);
    if (!role) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.rolesService.update(role, updateRoleDto);
    if (!result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove One Role' })
  @ApiResponse({ status: 200, description: 'Success Remove One Role.' })
  @ApiResponse({ status: 400, description: 'Failed Remove One Role.' })
  async remove(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<Role>> {
    const ctx: string = `Delete One Role ID: ${id}`;
    const role = await this.rolesService.findOne(id);
    if (!role) {
      response.status(404);
      return new BaseResponse(null, `Failed ${ctx}.`, 404, false);
    }
    const result = await this.rolesService.remove(role);
    if (result) {
      response.status(400);
      return new BaseResponse(result, `Failed ${ctx}.`, 400, false);
    }
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }
}
