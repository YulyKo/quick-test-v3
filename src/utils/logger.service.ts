import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { Logger, LoggerOptions } from 'winston';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
import { config } from '../config';

Injectable({ scope: Scope.TRANSIENT });
export class LoggerService {
  private readonly logger: Logger;
  private readonly prettyError = new PrettyError();
  public static loggerOptions: LoggerOptions = {
    level:
      config.env.NODE_ENV === config.constants.DEVELOPMENT
        ? config.constants.logger.levels.development
        : config.constants.logger.levels.production,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.prettyPrint({ colorize: true }),
          winston.format.timestamp({ format: 'HH:mm:ss A' }),
          winston.format.printf(
            ({ level, color, message, timestamp, context, scope, data }) => {
              const levelColored = color(level.toUpperCase());
              let dataStringify = '';
              if (typeof data === 'object') {
                dataStringify = `\n${JSON.stringify(data, null, ' ').slice(
                  2,
                  -2,
                )}`;
              }
              return `[${levelColored}] ${timestamp} ${chalk.yellow(
                `[${context}${scope ? ` — ${scope}` : ''}]`,
              )} ${color(` ${message}${dataStringify}`)}`;
            },
          ),
        ),
        silent: false,
      }),
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'DD MMM YYYY, HH:mm:ss A' }),
          winston.format.json(),
        ),
        filename: config.constants.logger.filename,
      }),
    ],
  };

  constructor(private context: string) {
    this.logger = winston.createLogger(LoggerService.loggerOptions);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  get Logger(): Logger {
    return this.logger;
  }
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options;
  }
  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options);
  }

  error(message: string, trace?: any, scope?: string, data?: any): void {
    this.logger.error(message, {
      context: this.context,
      color: chalk.red,
      scope,
      data,
    });
    if (trace && config.env.NODE_ENV === 'development') {
      this.prettyError.render(trace, true);
    }
  }
  warn(message: string, scope?: string, data?: any): void {
    this.logger.warn(message, {
      context: this.context,
      color: chalk.hex('#FFA500'),
      scope,
      data,
    });
  }
  log(message: string, scope?: string, data?: any): void {
    this.logger.info(message, {
      context: this.context,
      color: chalk.green,
      scope,
      data,
    });
  }
  debug(message: string, scope?: string, data?: any) {
    this.logger.debug(message, {
      context: this.context,
      color: chalk.blue,
      scope,
      data,
    });
  }
}
