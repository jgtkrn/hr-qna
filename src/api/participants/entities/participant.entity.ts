import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Activity } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class Participant extends BaseEntity<Participant> {
  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public participantId: string;

  @Column()
  public participantCode: string;

  @Column({ select: false })
  public password: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ default: false })
  public isLogin: boolean;

  @Column()
  public activityId: number;

  @Column()
  public emailSent: boolean;

  @Column()
  public emailSentLimit: number;

  @ManyToOne(() => Activity, (activity) => activity.participants, {
    cascade: true,
  })
  @JoinColumn()
  public activity: Activity;
}
