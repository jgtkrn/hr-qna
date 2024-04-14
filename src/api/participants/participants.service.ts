import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager, In, LessThan, Repository } from 'typeorm';

import { Activity, Participant, TestHistory } from '../../../entities';
import { SendMailRegulerDto } from '../../helper/mail/dto/send-mail-reguler.dto';
import { MailService } from '../../helper/mail/mail.service';
import { TextGenService } from '../../utils/generator/text-gen/text-gen.service';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { FilterParticipantDto } from './dto/filter-participant.dto';
import { FilterParticipantHistoryDto } from './dto/filter-participant-history.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { participantInvitationTemplate } from './template/participant.invitation';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Participant)
    private readonly participantsRepository: Repository<Participant>,
    @InjectRepository(TestHistory)
    private readonly testHistoryRepository: Repository<TestHistory>,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    private readonly textGenService: TextGenService,
    private readonly mailService: MailService,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    let result: Participant = null;
    try {
      createParticipantDto.password = await bcrypt.hash(
        createParticipantDto.password,
        12,
      );
      const participant = new Participant(createParticipantDto);
      const save = await this.entityManager.save(participant);
      result = await this.participantsRepository.findOneBy({ id: save.id });
      return result;
    } catch (error) {
      return result;
    }
  }

  async findAll() {
    let result: Participant[] = [];
    try {
      result = await this.participantsRepository.find({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
      return result;
    } catch (error) {
      return result;
    }
  }

  async findMyTestHistory(
    query: FilterParticipantHistoryDto,
    participantId: number,
    activityId: number,
  ): Promise<any> {
    let results: any[] = [];
    try {
      const where: any = {
        participantId,
        activityId,
      };
      if (query.type) {
        where.type = query.type;
      }
      results = await this.testHistoryRepository.find({ where });
      return results;
    } catch (error) {
      return results;
    }
  }

  async updateEndedTest(): Promise<any> {
    const results: boolean = false;
    const activityIds: number[] = [];
    try {
      const activities = await this.activityRepository.find({
        where: {
          endTime: LessThan(new Date()),
          isActive: true,
        },
        select: {
          id: true,
        },
      });
      if (activities.length === 0) {
        return results;
      }
      for (let i = 0; i < activities.length; i++) {
        activityIds.push(activities[i].id);
      }
      const testHistory = await this.dataSource
        .getRepository(TestHistory)
        .createQueryBuilder()
        .update(TestHistory)
        .set({
          status: 'FINISHED',
        })
        .where({
          activityId: In(activityIds),
          status: 'IN_PROGRESS',
        })
        .execute();
      if (testHistory) {
        return true;
      } else {
        return results;
      }
    } catch (error) {
      return results;
    }
  }

  async findOne(id: number) {
    let result: Participant = null;
    try {
      result = await this.participantsRepository.findOneBy({ id });
      return result;
    } catch {
      return result;
    }
  }

  async findByEmail(email: string) {
    let result: Participant = null;
    try {
      result = await this.participantsRepository.findOneBy({ email });
      return result;
    } catch {
      return result;
    }
  }

  async findByEmailAndActivityId(email: string, activityId: number) {
    let result: Participant = null;
    try {
      result = await this.participantsRepository.findOneBy({
        email,
        activityId,
      });
      return result;
    } catch {
      return result;
    }
  }

  async findByEmailAddPassword(email: string, token: string) {
    let result: Participant = null;
    try {
      result = await this.dataSource
        .getRepository(Participant)
        .createQueryBuilder()
        .select('participant')
        .from(Participant, 'participant')
        .where(
          'participant.email = :email AND participant.participantCode = :token',
          { email, token },
        )
        .addSelect('participant.password')
        .getOne();
      return result;
    } catch {
      return result;
    }
  }

  async update(
    participant: Participant,
    updateParticipantDto: UpdateParticipantDto,
  ) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        participant.name = updateParticipantDto.name
          ? updateParticipantDto.name
          : participant.name;
        participant.isActive = updateParticipantDto.isActive
          ? updateParticipantDto.isActive
          : participant.isActive;
        participant.isLogin = updateParticipantDto.isLogin
          ? updateParticipantDto.isLogin
          : participant.isLogin;
        await entityManager.save(participant);
      });
      return await this.participantsRepository.findOneBy({
        id: participant.id,
      });
    } catch (error) {
      return null;
    }
  }

  async remove(participant: Participant) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        participant.isActive = false;
        participant.deletedAt = new Date();
        await entityManager.save(participant);
      });
      return await this.participantsRepository.findOneBy({
        id: participant.id,
      });
    } catch (error) {
      return null;
    }
  }

  async insertMany(
    query: FilterParticipantDto,
    payload: any[],
  ): Promise<Participant[]> {
    let results: Participant[] = [];
    const participants: Participant[] = [];
    try {
      const countExistParticipant = await this.participantsRepository.find({
        where: {
          activityId: query.activityId,
        },
      });
      if (countExistParticipant.length + payload.length > 100) {
        return results;
      }
      for (let i = 0; i < payload.length; i++) {
        const data = new Participant(payload[i]);
        const dateCode = await this.textGenService.getDateString();
        const suffix = await this.textGenService.randomString(4);
        data.participantId = `PAR-${dateCode}-${suffix}`;
        data.participantCode = await this.textGenService.randomString();
        data.activityId = query.activityId;
        data.isActive = false;
        participants.push(data);
      }
      if (participants.length > 0) {
        results = await this.entityManager.save(participants);
      }
      return results;
    } catch (error) {
      return results;
    }
  }

  async inviteOne(payload: UpdateParticipantDto): Promise<Participant> {
    let result: Participant = null;
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
      const participant = await this.participantsRepository.findOneBy(param);
      if (!participant) return null;
      if (participant) {
        const activity = await this.activityRepository.findOneBy({
          id: participant.activityId,
        });
        participant.password = await bcrypt.hash(randomPass, 12);
        participant.isActive = true;
        const url = `${process.env.CLIENT_DOMAIN}/login?token=${participant.participantCode}`;
        const mail = new SendMailRegulerDto();
        mail.from = `No-Reply <${process.env.MAIL_USER}>`;
        mail.to = participant.email;
        mail.subject = 'AMOEBA Participant Invitation';
        mail.html = await participantInvitationTemplate(
          activity.name,
          participant.name,
          participant.email,
          randomPass,
          url,
        );
        const sendMail = await this.mailService.sendMail(mail);
        if (!sendMail) {
          participant.emailSent = false;
          participant.emailSentLimit = 0;
        } else {
          participant.emailSent = true;
          participant.emailSentLimit = 0;
        }
        const save = await this.entityManager.save(participant);
        if (save && !sendMail) return result;
        if (!save) return result;
      }
      result = await this.participantsRepository.findOneBy({
        id: participant.id,
      });
      return result;
    } catch (error) {
      return result;
    }
  }

  async inviteOneFailed(payload: UpdateParticipantDto): Promise<Participant> {
    let result: Participant = null;
    const email: string = payload.email ? payload.email : null;
    const param: any = {
      isActive: true,
      deletedAt: null,
      emailSent: false,
      emailSentLimit: 3,
    };
    try {
      const randomPass = await this.textGenService.randomString(8);
      if (email) {
        param.email = email;
      }
      const participant = await this.dataSource
        .getRepository(Participant)
        .createQueryBuilder()
        .select('participant')
        .from(Participant, 'participant')
        .where(
          `participant.emailSent = :emailSent AND
                           participant.emailSentLimit < :emailSentLimit
                          `,
          param,
        )
        .getOne();
      if (!participant) return null;
      if (participant) {
        participant.password = await bcrypt.hash(randomPass, 12);
        participant.isActive = true;
        const mail = new SendMailRegulerDto();
        mail.from = `No-Reply <${process.env.MAIL_USER}>`;
        mail.to = participant.email;
        mail.subject = 'AMOEBA Participant Invitation';
        mail.html = `
          <body>
              <h1>Participant Attendance</h1>
              <p>You have invited to amoeba!</p>
              <h5>Don't share this credential to anyone!</h5>
              <p>email: ${participant.email}</p>
              <p>password: ${randomPass}</p>
              <p>token: ${participant.participantCode}</p>
              <p>silahkan login melalui halaman ini <a href="${process.env.CLIENT_DOMAIN}/login?token=${participant.participantCode}">login page</a></p>
          </body>
        `;
        const sendMail = await this.mailService.sendMail(mail);
        if (!sendMail) {
          participant.emailSent = false;
          participant.emailSentLimit = participant.emailSentLimit
            ? participant.emailSentLimit + 1
            : 1;
        } else {
          participant.emailSent = true;
          participant.emailSentLimit = participant.emailSentLimit
            ? participant.emailSentLimit + 1
            : 1;
        }
        const save = await this.entityManager.save(participant);
        if (save && !sendMail) return result;
        if (!save) return result;
      }
      result = await this.participantsRepository.findOneBy({
        id: participant.id,
      });
      return result;
    } catch (error) {
      return result;
    }
  }
}
