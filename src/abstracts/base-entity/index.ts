import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity<T> {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
