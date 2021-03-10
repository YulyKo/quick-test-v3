import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { constants } from './constants';

dotenv.config();
class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  TYPEORM_HOST: string;

  @IsNumber()
  TYPEORM_PORT: number;

  @IsString()
  TYPEORM_USERNAME: string;

  @IsString()
  TYPEORM_PASSWORD: string;

  @IsString()
  TYPEORM_DATABASE: string;

  @IsString()
  TYPEORM_MIGRATIONS: string;

  @IsString()
  TYPEORM_MIGRATIONS_DIR: string;

  @IsString()
  TYPEORM_ENTITIES: string;

  @IsString()
  TYPEORM_SYNCHRONIZE: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRATION_TIME: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRATION_TIME: string;
}

const validation = () => {
  const config = {
    PORT: parseInt(process.env.PORT, 10) || 3000,

    TYPEORM_HOST: process.env.TYPEORM_HOST,
    TYPEORM_PORT: parseInt(process.env.TYPEORM_PORT),
    TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
    TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD || '',
    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
    TYPEORM_ENTITIES: process.env.TYPEORM_ENTITIES,
    TYPEORM_MIGRATIONS: process.env.TYPEORM_MIGRATIONS,
    TYPEORM_MIGRATIONS_DIR: process.env.TYPEORM_MIGRATIONS_DIR,
    TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
  };
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

export const config = {
  constants,
  env: validation(),
};
