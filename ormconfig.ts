import './src/boilerplate.polyfill';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from './src/strategies/snake-naming.strategy';

config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
