import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_POSTGRES_HOST'),
        port: configService.get('DB_POSTGRES_PORT'),
        username: configService.get('DB_POSTGRES_USER'),
        password: configService.get('DB_POSTGRES_PASSWORD'),
        database: configService.get('DB_POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity.ts'],
        synchronize: true,
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations_typeorm',
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
