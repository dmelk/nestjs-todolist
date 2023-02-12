import { Module } from '@nestjs/common';
import { TaskTransformer } from './transformer/task.transformer';
import { TaskResolver } from './resolver/task.resolver';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule],
  providers: [TaskTransformer, TaskResolver],
  exports: [],
})
export class TaskModule {}
