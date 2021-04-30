import { HttpException, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { LoggerService } from './logger.service';

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  logger = new LoggerService(ExceptionsLoggerFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception.message, exception.stack);
    super.catch(exception, host);
  }
}
