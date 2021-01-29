import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  DB_POSTGRES_HOST: string;

  @IsNumber()
  DB_POSTGRES_PORT: number;

  @IsString()
  DB_POSTGRES_USER: string;

  @IsString()
  DB_POSTGRES_PASSWORD: string;

  @IsString()
  DB_POSTGRES_DB: string;
}

export default () => {
  const config = {
    PORT: parseInt(process.env.PORT, 10) || 3000,

    DB_POSTGRES_HOST: process.env.DB_POSTGRES_HOST,
    DB_POSTGRES_PORT: parseInt(process.env.DB_POSTGRES_PORT),
    DB_POSTGRES_USER: process.env.DB_POSTGRES_USER,
    DB_POSTGRES_PASSWORD: process.env.DB_POSTGRES_PASSWORD || '',
    DB_POSTGRES_DB: process.env.DB_POSTGRES_DB,
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
