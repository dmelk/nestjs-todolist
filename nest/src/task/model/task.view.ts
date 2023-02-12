import { Field, ObjectType } from '@nestjs/graphql';
import { TaskEntity } from '../entity/task.entity';

@ObjectType()
export class TaskView {
  @Field()
  public readonly id: string;

  @Field()
  public readonly description: string;

  @Field()
  public readonly status: string;

  public constructor(entity: TaskEntity) {
    this.id = entity.id;
    this.description = entity.description;
    this.status = entity.status;
  }
}
