import { Column, Entity, JoinTable, OneToOne } from 'typeorm';

import { User } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class Subscription extends BaseEntity<Subscription> {
  @Column({ default: 0.0 })
  public amount: number;

  @Column({ default: true })
  public isActive: boolean;

  @Column()
  public userId: number;

  @OneToOne(() => User, (user) => user.subscription, {
    cascade: true,
  })
  @JoinTable()
  public user: User;
}
