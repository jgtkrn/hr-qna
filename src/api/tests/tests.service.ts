import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { ActivityTest, Test } from '../../../entities';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testsRepository: Repository<Test>,
    @InjectRepository(ActivityTest)
    private readonly activityTestRepository: Repository<ActivityTest>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    let result: Test = null;
    try {
      const test = new Test(createTestDto);
      result = await this.entityManager.save(test);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<Test[]> {
    let result: Test[] = [];
    try {
      result = await this.testsRepository.find({
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

  async findOne(id: number): Promise<Test> {
    let result: Test = null;
    try {
      result = await this.testsRepository.findOneBy({ id });
      if (result === null) {
        return null;
      }
      return result;
    } catch {
      return null;
    }
  }

  async update(test: Test, updateTestDto: UpdateTestDto): Promise<Test> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        test.name = updateTestDto.name ? updateTestDto.name : test.name;
        test.isActive = updateTestDto.isActive
          ? updateTestDto.isActive
          : test.isActive;
        test.description = updateTestDto.description
          ? updateTestDto.description
          : test.description;
        test.token = updateTestDto.token ? updateTestDto.token : test.token;
        test.duration = updateTestDto.duration
          ? updateTestDto.duration
          : test.duration;
        test.thumbnail = updateTestDto.thumbnail
          ? updateTestDto.thumbnail
          : test.thumbnail;
        test.type = updateTestDto.type ? updateTestDto.type : test.type;
        test.status = updateTestDto.status ? updateTestDto.status : test.status;
        await entityManager.save(test);
      });
      return this.testsRepository.findOneBy({ id: test.id });
    } catch {
      return null;
    }
  }

  async remove(test: Test): Promise<Test> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        test.isActive = false;
        test.deletedAt = new Date();
        await entityManager.save(test);
      });
      return this.testsRepository.findOneBy({ id: test.id });
    } catch {
      return null;
    }
  }

  async findAllByActivities(dto: any): Promise<any> {
    try {
      return dto;
    } catch {
      return null;
    }
  }

  async findAllByIds(ids: number[]): Promise<Test[]> {
    let result: Test[] = [];
    try {
      result = await this.testsRepository.find({
        where: {
          id: In([...ids]),
          isActive: true,
          deletedAt: null,
        },
      });
      return result;
    } catch {
      return result;
    }
  }
}
