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
  JWT_SECRET: string;
}

const validation = () => {
  const config = {
    PORT: parseInt(process.env.PORT, 10) || 3000,

    TYPEORM_HOST: process.env.TYPEORM_HOST,
    TYPEORM_PORT: parseInt(process.env.TYPEORM_PORT),
    TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
    TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD || '',
    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
    TYPEORM_MIGRATIONS: process.env.TYPEORM_MIGRATIONS,

    JWT_SECRET: process.env.JWT_SECRET,
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
