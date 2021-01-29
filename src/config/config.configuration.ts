import { plainToClass } from 'class-transformer';
import { IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  port: number;
}

export default () => {
  const config = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
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
