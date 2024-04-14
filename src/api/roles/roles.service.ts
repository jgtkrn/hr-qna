import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Role } from '../../../entities';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    let result: Role = null;
    try {
      const role = new Role(createRoleDto);
      result = await this.entityManager.save(role);
      return result;
    } catch {
      return result;
    }
  }

  async findAll(): Promise<Role[]> {
    let result: Role[] = [];
    try {
      result = await this.rolesRepository.find({
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

  async findOne(id: number): Promise<Role> {
    let result: Role = null;
    try {
      result = await this.rolesRepository.findOneBy({ id });
      return result;
    } catch {
      return result;
    }
  }

  async update(role: Role, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        role.name = updateRoleDto.name ? updateRoleDto.name : role.name;
        role.isActive = updateRoleDto.isActive
          ? updateRoleDto.isActive
          : role.isActive;
        await entityManager.save(role);
      });
      return this.rolesRepository.findOneBy({ id: role.id });
    } catch {
      return null;
    }
  }

  async remove(role: Role) {
    try {
      await this.entityManager.transaction(async (entityManager) => {
        role.isActive = false;
        role.deletedAt = new Date();
        await entityManager.save(role);
      });
      return this.rolesRepository.findOneBy({ id: role.id });
    } catch {
      return null;
    }
  }
}
