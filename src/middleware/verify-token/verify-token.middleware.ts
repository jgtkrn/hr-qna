import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { ParticipantsService } from '../../api/participants/participants.service';
import { UsersService } from '../../api/users/users.service';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly participantsService: ParticipantsService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const [type, cred] = req.headers.authorization?.split(' ') ?? [];
    const token = type === 'Bearer' ? cred : undefined;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (new Date(payload.exp * 1000) < new Date()) {
        throw new UnauthorizedException();
      }
      if (payload.email && !payload.activityId) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
          throw new UnauthorizedException();
        }
        if (user.isActive === false) {
          throw new UnauthorizedException();
        }
        req['user'] = user;
      }
      if (payload.activityId) {
        const user = await this.participantsService.findByEmailAndActivityId(
          payload.email,
          payload.activityId,
        );
        if (!user) {
          throw new UnauthorizedException();
        }
        if (user.isActive === false) {
          throw new UnauthorizedException();
        }
        req['user'] = user;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    next();
  }
}
