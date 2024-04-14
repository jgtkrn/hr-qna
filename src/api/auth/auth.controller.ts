import {
  Body,
  Controller,
  Inject,
  Injectable,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

import { User } from '../../../entities';
import { BaseResponse } from '../../abstracts/base-response';
import { ParticipantsService } from '../participants/participants.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly participantsService: ParticipantsService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Success Register.' })
  @ApiResponse({ status: 400, description: 'Failed Register.' })
  @ApiResponse({ status: 409, description: 'User Exist.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response,
  ): Promise<BaseResponse<User>> {
    const ctx: string = 'Register User';
    let result: User = null;
    if (registerDto.password !== registerDto.confirmedPassword) {
      response.status(400);
      return new BaseResponse(
        result,
        `Failed ${ctx}, password does not match.`,
        400,
        false,
      );
    }

    const isUserExist = await this.usersService.findByEmail(registerDto.email);
    if (isUserExist) {
      response.status(409);
      return new BaseResponse(
        result,
        `Failed ${ctx}, user with email: ${registerDto.email} already exist, please login.`,
        409,
        false,
      );
    }

    const createUserDto: CreateUserDto = {
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      roleId: registerDto.roleId ? registerDto.roleId : 3,
    };

    result = await this.usersService.create(createUserDto);
    if (!result) {
      response.status(409);
      return new BaseResponse(
        result,
        `Failed ${ctx} user with email: ${registerDto.email}.`,
        409,
        false,
      );
    }

    response.status(201);
    return new BaseResponse(
      result,
      `Success ${ctx} user with email: ${registerDto.email}.`,
      201,
      false,
    );
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Success Login.' })
  @ApiResponse({ status: 400, description: 'Failed Login.' })
  @ApiResponse({ status: 409, description: 'Wrong Credential.' })
  async login(
    @Body() loginDto: LoginDto,
    @Query() query,
    @Res({ passthrough: true }) response,
  ) {
    let result: string = null;
    let isUserExist = null;
    const loginData: any = {};
    const ctx: string = 'Login User';
    if (query.token) {
      isUserExist = await this.participantsService.findByEmailAddPassword(
        loginDto.email,
        query.token,
      );
    } else {
      isUserExist = await this.usersService.findByEmailAddPassword(
        loginDto.email,
      );
    }
    if (!isUserExist) {
      response.status(409);
      return new BaseResponse(
        result,
        `Failed ${ctx}, user with email: ${loginDto.email} does not exist, please ask admin.`,
        409,
        false,
      );
    }

    if (!(await bcrypt.compare(loginDto.password, isUserExist.password))) {
      response.status(400);
      return new BaseResponse(
        result,
        `Failed ${ctx}, wrong credential.`,
        400,
        false,
      );
    }

    loginData.id = isUserExist.id;
    loginData.name = isUserExist.name;
    loginData.email = isUserExist.email;
    loginData.isActive = isUserExist.isActive;
    if (query.token) {
      loginData.participantId = isUserExist.participantId;
      loginData.participantCode = isUserExist.participantCode;
      loginData.activityId = isUserExist.activityId;
    } else {
      loginData.roleId = isUserExist.roleId;
    }

    result = await this.jwtService.signAsync(loginData);

    response.cookie('jwt', result, { httpOnly: true });
    response.status(200);
    return new BaseResponse(result, `Success ${ctx}.`, 200, true);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Success Logout.' })
  async logout(@Res({ passthrough: true }) response) {
    const ctx: string = 'Logout User';
    response.clearCookie('jwt');
    return new BaseResponse(null, `Success ${ctx}.`, 200, true);
  }
}
