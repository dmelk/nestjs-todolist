import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import typeOrmConfig from './common/config/type-orm.config';
import { SecurityModule } from './security/security.module';
import { TaskModule } from './task/task.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    SecurityModule,
    TaskModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: [process.cwd(), '/public/gql-schema.txt'].join(''),
    }),
    TypeOrmCoreModule.forRoot(typeOrmConfig),
  ],
})
export class AppModule {}
