import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';

import { ActivityTest, Participant, User } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

import { ActivityStatus } from './enum/activity-status.enum';

@Entity()
export class Activity extends BaseEntity<Activity> {
  @Column()
  public name: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ nullable: true })
  public startTime: Date;

  @Column({ nullable: true })
  public endTime: Date;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public tokenPerUser: number;

  @Column({ nullable: true })
  public tokenMax: number;

  @Column({ type: 'enum', enum: ActivityStatus, nullable: true })
  public status: string;

  @Column({ nullable: true })
  public isProctoring: boolean;

  @Column({ nullable: true })
  public createdBy: number;

  @Column({ nullable: true })
  public updatedBy: number;

  @ManyToMany(() => User, (user) => user.activities)
  public users: User[];

  @OneToMany(() => ActivityTest, (activitytest) => activitytest.activity)
  public activityTests: ActivityTest[];

  @OneToMany(() => Participant, (participant) => participant.activity)
  @JoinColumn()
  public participants: Participant[];
}
