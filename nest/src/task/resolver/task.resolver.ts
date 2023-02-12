import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { TaskEntity } from '../entity/task.entity';
import { TaskTransformer } from '../transformer/task.transformer';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskView } from '../model/task.view';
import { IdDto } from '../../common/dto/id.dto';
import { TaskStatus } from '../types/task-status';
import { TaskCollectionView } from '../model/task-collection.view';
import { JwtAuthGuard } from '../../security/guard/jwt.auth-guard';
import { UserInputError } from 'apollo-server-express';

@Resolver()
@Injectable()
export class TaskResolver {
  private readonly repository: Repository<TaskEntity>;

  public constructor(
    private readonly transformer: TaskTransformer,
    @InjectEntityManager() entityManager: EntityManager,
  ) {
    this.repository = entityManager.getRepository(TaskEntity);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TaskCollectionView)
  public async tasks(
    @Context() ctx: any,
    @Args({ name: 'skip', type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
    @Args({ name: 'take', type: () => Int, nullable: true, defaultValue: 20 })
    take: number,
    @Args({
      name: 'all',
      type: () => Boolean,
      nullable: true,
      defaultValue: false,
    })
    all: boolean,
  ): Promise<TaskCollectionView> {
    try {
      const findOptions: FindOptionsWhere<TaskEntity> = {
        userId: ctx.userId,
      };

      if (!all) {
        findOptions.status = TaskStatus.NEW;
      }

      const [entities, total] = await this.repository.findAndCount({
        where: findOptions,
        skip: skip,
        take: take,
        order: {
          id: 'ASC',
        },
      });

      return new TaskCollectionView(entities, total);
    } catch (e) {
      throw new UserInputError(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TaskView)
  public async createTask(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => CreateTaskDto }) dto: CreateTaskDto,
  ): Promise<TaskView> {
    try {
      const userId = ctx.userId;
      const entity = await this.transformer.createTask(dto, userId);
      return new TaskView(entity);
    } catch (e) {
      throw new UserInputError(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TaskView)
  public async completeTask(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => IdDto }) dto: IdDto,
  ): Promise<TaskView> {
    try {
      const entity = await this.transformer.changeStatus(
        ctx.userId,
        dto.id,
        TaskStatus.DONE,
      );
      return new TaskView(entity);
    } catch (e) {
      throw new UserInputError(e.message);
    }
  }
}
