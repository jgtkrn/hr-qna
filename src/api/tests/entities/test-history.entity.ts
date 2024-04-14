import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class TestHistory extends BaseEntity<TestHistory> {
  @Column({ default: true })
  public isActive: boolean;

  @Column({ nullable: true })
  public startTime: Date;

  @Column({ nullable: true })
  public endTime: Date;

  @Column()
  public questionAnswered: number;

  @Column()
  public questionNotAnswered: number;

  @Column()
  public answerCorrect: number;

  @Column()
  public answerIncorrect: number;

  @Column()
  public percentage: number;

  @Column()
  public activityId: number;

  @Column()
  public testId: number;

  @Column()
  public participantId: number;

  @Column({ nullable: true })
  public duration: number;

  @Column({ nullable: true })
  public status: string;

  @Column({ nullable: true })
  public type: string;
}
