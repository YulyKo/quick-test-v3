import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: config.env.TYPEORM_HOST,
        port: config.env.TYPEORM_PORT,
        username: config.env.TYPEORM_USERNAME,
        password: config.env.TYPEORM_PASSWORD,
        database: config.env.TYPEORM_DATABASE,
        entities: ['src/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: ['src/migrations/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
