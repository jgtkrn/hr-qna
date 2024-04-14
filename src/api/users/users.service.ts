import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { User } from '../../../entities';
import { SendMailRegulerDto } from '../../helper/mail/dto/send-mail-reguler.dto';
import { MailService } from '../../helper/mail/mail.service';
import { TextGenService } from '../../utils/generator/text-gen/text-gen.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    private readonly textGenService: TextGenService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let result: User = null;
    try {
      const isUserExist = await this.findByEmail(createUserDto.email);
      if (isUserExist) {
        return result;
      }
      createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
      const user = new User(createUserDto);
      const dateCode = await this.textGenService.getDateString();
      const suffix = await this.textGenService.randomString(4);
      if (user.roleId === 1) {
        user.userId = `ADM-${dateCode}-${suffix}`;
      } else {
        user.userId = `HR-${dateCode}-${suffix}`;
      }
      const save = await this.entityManager.save(user);
      result = await this.usersRepository.findOneBy({ email: save.email });
      return result;
    } catch {
      return result;
    }
  }

  async createInvite(createUserDto: CreateUserDto) {
    let result: User = null;
    try {
      const isUserExist = await this.findByEmail(createUserDto.email);
      if (isUserExist) {
        return result;
      }
      createUserDto.password = null;
      createUserDto.isActive = false;
      const user = new User(createUserDto);
      const dateCode = await this.textGenService.getDateString();
      const suffix = await this.textGenService.randomString(4);
      if (user.roleId === 1) {
        user.userId = `ADM-${dateCode}-${suffix}`;
      } else {
        user.userId = `HR-${dateCode}-${suffix}`;
      }
      const save = await this.entityManager.save(user);
      result = await this.usersRepository.findOneBy({ email: save.email });
      return result;
    } catch {
      return result;
    }
  }

  async findAll() {
    let result: User[] = [];
    try {
      result = await this.usersRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
      return result;
    } catch {
      return result;
    }
  }

  async findOne(id: number) {
    let result: User = null;
    try {
      result = await this.usersRepository.findOneBy({ id });
      return result;
    } catch {
      return result;
    }
  }

  async findByEmail(email: string) {
    let result: User = null;
    try {
      result = await this.usersRepository.findOneBy({ email });
      return result;
    } catch {
      return result;
    }
  }

  async findByEmailAddPassword(email: string) {
    let result: User = null;
    try {
      result = await this.dataSource
        .getRepository(User)
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.email = :email', { email })
        .addSelect('user.password')
        .getOne();
      return result;
    } catch {
      return result;
    }
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        user.name = updateUserDto.name ? updateUserDto.name : user.name;
        user.email = updateUserDto.email ? updateUserDto.email : user.email;
        user.roleId = updateUserDto.roleId ? updateUserDto.roleId : user.roleId;
        user.password = updateUserDto.password
          ? await bcrypt.hash(updateUserDto.password, 12)
          : user.password;
        user.isActive = updateUserDto.isActive
          ? updateUserDto.isActive
          : user.isActive;
        user.isLogin = updateUserDto.isLogin
          ? updateUserDto.isLogin
          : user.isLogin;
        await entityManager.save(user);
      });
      return await this.usersRepository.findOneBy({ id: user.id });
    } catch {
      return null;
    }
  }

  async remove(user: User) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        user.isActive = false;
        user.deletedAt = new Date();
        await entityManager.save(user);
      });
      return await this.usersRepository.findOneBy({ id: user.id });
    } catch {
      return null;
    }
  }

  async inviteOne(payload: CreateUserDto): Promise<User> {
    let result: User = null;
    const email: string = payload.email ? payload.email : null;
    const param: any = {
      isActive: false,
      deletedAt: null,
      password: null,
    };
    try {
      const randomPass = await this.textGenService.randomString(8);
      if (email) {
        param.email = email;
      }
      const user = await this.usersRepository.findOneBy(param);
      if (!user) return null;
      if (user) {
        user.password = await bcrypt.hash(randomPass, 12);
        user.isActive = true;
        const save = await this.entityManager.save(user);
        if (!save) return result;
        const mail = new SendMailRegulerDto();
        mail.from = `No-Reply <${process.env.MAIL_USER}>`;
        mail.to = user.email;
        mail.subject = 'AMOEBA User Invitation';
        mail.html = `
          <body>
              <h1>User Invitation</h1>
              <p>You have invited to amoeba!</p>
              <h5>Don't share this credential to anyone!</h5>
              <p>email: ${user.email}</p>
              <p>password: ${randomPass}</p>
              <p>silahkan login melalui halaman ini <a href="${process.env.CLIENT_DOMAIN}/login">login page</a></p>
          </body>
        `;
        const sendMail = await this.mailService.sendMail(mail);
        if (!sendMail) console.log('Email not sent!');
      }
      result = await this.usersRepository.findOneBy({ id: user.id });
      return result;
    } catch {
      return result;
    }
  }
}
