import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: '123123',
  database: 'todolist',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../../../migration/*.ts'],
  logging: false,
};

export default typeOrmConfig;
