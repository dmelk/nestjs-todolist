import { DataSource } from 'typeorm';
import { typeOrmConfig } from './type-orm.config';

const dataSourceConfig = { ...typeOrmConfig };
dataSourceConfig.migrations = [process.cwd() + '/migration/*.ts'];
dataSourceConfig.entities = [process.cwd() + '/src/**/*.entity{.ts,.js}'];

const typeOrmDataSource = new DataSource(dataSourceConfig);

export default typeOrmDataSource;
