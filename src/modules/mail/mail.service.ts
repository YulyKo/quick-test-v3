import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ForgotPasswordDto } from './dto/forgotPasswordDto';
import { config } from '../../config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async forgotPassword(credentials: ForgotPasswordDto) {
    await this.mailerService.sendMail({
      to: credentials.email,
      from: config.constants.mailer.from,
      subject: config.constants.mailer.forgotPassword.subject,
      template: config.constants.mailer.forgotPassword.template,
      context: {
        code: credentials.code,
        name: credentials.name,
      },
    });
  }
}
