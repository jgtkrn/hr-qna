import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Activity, Test } from '../../../../entities';
import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class ActivityTest extends BaseEntity<ActivityTest> {
  @Column()
  public activityId: number;

  @Column()
  public testId: number;

  @Column()
  public order: number;

  @ManyToOne(() => Activity, (activity) => activity.activityTests, {
    cascade: true,
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  public activity: Activity;

  @ManyToOne(() => Test, (test) => test.activityTests, {
    cascade: true,
    orphanedRowAction: 'nullify',
  })
  @JoinColumn()
  public test: Test;
}
