import { Column, Entity, OneToMany } from 'typeorm';

import { ActivityTest, Qna } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

import { TestStatus } from './enum/test-status.enum';

@Entity()
export class Test extends BaseEntity<Test> {
  @Column()
  public name: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public token: number;

  @Column({ nullable: true })
  public duration: number;

  @Column({ nullable: true })
  public thumbnail: string;

  @Column({ nullable: true })
  public type: string;

  @Column({ type: 'enum', enum: TestStatus, nullable: true })
  public status: string;

  @OneToMany(() => ActivityTest, (activitytest) => activitytest.test)
  public activityTests: ActivityTest[];

  @OneToMany(() => Qna, (qna) => qna.test)
  public qnas: Qna[];
}
