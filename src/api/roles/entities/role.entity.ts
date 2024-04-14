import { Column, Entity, JoinTable, OneToMany } from 'typeorm';

import { User } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class Role extends BaseEntity<Role> {
  @Column()
  public name: string;

  @Column({ default: true })
  public isActive: boolean;

  @OneToMany(() => User, (user) => user.role)
  @JoinTable()
  public users: User[];
}
