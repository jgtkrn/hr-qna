import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

import { RequestStatus } from './enum/request-status.enum';

@Entity()
export class SubscriptionHistory extends BaseEntity<SubscriptionHistory> {
  @Column({ default: 0.0 })
  public amount: number;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ type: 'enum', enum: RequestStatus, nullable: true })
  public status: string;

  @Column()
  public userId: number;

  @ManyToOne(() => User, (user) => user.subscriptionHistories, {
    cascade: true,
  })
  @JoinColumn()
  public user: User;
}
