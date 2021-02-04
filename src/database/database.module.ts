import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: config.TYPEORM_HOST,
        port: config.TYPEORM_PORT,
        username: config.TYPEORM_USERNAME,
        password: config.TYPEORM_PASSWORD,
        database: config.TYPEORM_DATABASE,
        entities: ['src/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: ['src/migrations/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
