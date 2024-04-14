import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../abstracts/base-entity';

@Entity()
export class File extends BaseEntity<File> {
  @Column()
  public filename: string;

  @Column()
  public extension: string;

  @Column({ default: 0 })
  public size: number;
}
