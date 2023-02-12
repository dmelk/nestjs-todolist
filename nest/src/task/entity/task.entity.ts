import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../security/entity/user.entity';
import { TaskStatusType } from '../types/task-status';

@Entity({
  name: 'task',
})
@Index('assign_status_id', ['userId', 'status'], {})
export class TaskEntity {
  @PrimaryColumn('varchar', { length: 36 })
  public id: string;

  @Column('varchar', { length: 36 })
  public userId: string;

  @ManyToOne(() => UserEntity)
  public user: UserEntity;

  @Column('varchar', { length: 4 })
  public status: TaskStatusType;

  @Column('text')
  public description: string;
}
