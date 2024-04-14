import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import {
  Activity,
  Role,
  Subscription,
  SubscriptionHistory,
} from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ default: false })
  public isLogin: boolean;

  @Column()
  public roleId: number;

  @Column()
  public userId: string;

  @Column()
  public emailSent: boolean;

  @Column()
  public emailSentLimit: number;

  @ManyToOne(() => Role, (role) => role.users, {
    cascade: true,
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  public role: Role;

  @OneToOne(() => Subscription, (subscription) => subscription.user)
  public subscription: Subscription;

  @ManyToMany(() => Activity, (activity) => activity.users)
  @JoinTable()
  public activities: Activity[];

  @OneToMany(
    () => SubscriptionHistory,
    (subscriptionHistory) => subscriptionHistory.user,
  )
  public subscriptionHistories: SubscriptionHistory[];
}
