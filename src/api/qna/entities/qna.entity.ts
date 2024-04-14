import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Test } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class Qna extends BaseEntity<Qna> {
  @Column()
  public question: string;

  @Column()
  public answers: string;

  @Column()
  public key: string;

  @Column()
  public type: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column()
  public testId: number;

  @ManyToOne(() => Test, (test) => test.qnas, {
    cascade: true,
  })
  @JoinColumn()
  public test: Test;
}
