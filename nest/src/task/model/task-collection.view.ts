import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TaskView } from './task.view';
import { TaskEntity } from '../entity/task.entity';

@ObjectType()
export class TaskCollectionView {
  @Field(() => [TaskView])
  public readonly records: TaskView[];

  @Field(() => Int)
  public readonly total: number;

  public constructor(entities: TaskEntity[], total: number) {
    this.total = total;

    this.records = [];
    entities.forEach((entity) => this.records.push(new TaskView(entity)));
  }
}
