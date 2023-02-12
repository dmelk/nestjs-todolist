import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../../security/entity/user.entity';
import { TaskEntity } from '../entity/task.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { randomUUID } from 'crypto';
import { TaskStatus, TaskStatusType } from '../types/task-status';

export class TaskTransformer {
  private readonly userRepository: Repository<UserEntity>;

  private readonly repository: Repository<TaskEntity>;

  public constructor(@InjectEntityManager() entityManager: EntityManager) {
    this.userRepository = entityManager.getRepository(UserEntity);
    this.repository = entityManager.getRepository(TaskEntity);
  }

  public async createTask(
    dto: CreateTaskDto,
    userId: string,
  ): Promise<TaskEntity> {
    const userEntity = await this.userRepository.findOneBy({ id: userId });
    if (!userEntity) {
      throw new Error('User not found');
    }
    const taskEntity = new TaskEntity();
    taskEntity.id = randomUUID();
    taskEntity.user = userEntity;
    taskEntity.status = TaskStatus.NEW;
    taskEntity.description = dto.description;

    await this.repository.save(taskEntity);

    return taskEntity;
  }

  public async changeStatus(
    userId: string,
    id: string,
    status: TaskStatusType,
  ): Promise<TaskEntity> {
    const taskEntity = await this.repository.findOneBy({ id: id });
    if (!taskEntity || taskEntity.userId !== userId) {
      throw new Error('Task not found');
    }
    taskEntity.status = status;
    await this.repository.save(taskEntity);

    return taskEntity;
  }
}
