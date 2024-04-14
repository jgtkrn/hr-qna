import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class QnaHistory extends BaseEntity<QnaHistory> {
  @Column({ default: true })
  public isCorrect: boolean;

  @Column()
  public activityId: number;

  @Column()
  public testId: number;

  @Column()
  public participantId: number;

  @Column()
  public qnaId: number;

  @Column({ nullable: true })
  public answer: string;

  @Column({ nullable: true })
  public key: string;

  @Column({ nullable: true })
  public type: string;
}
