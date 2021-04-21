import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { google } from 'googleapis';

import { MailService } from './mail.service';
import { config } from '../../config';

let refreshToken = config.env.MAILER_CLIENT_REFRESH_TOKEN;
let accessToken;

const oauth2Client = new google.auth.OAuth2(
  config.env.MAILER_CLIENT_ID,
  config.env.MAILER_CLIENT_SECRET,
  config.constants.mailer.OAuthPlayground,
);
oauth2Client.setCredentials({
  // eslint-disable-next-line camelcase
  refresh_token: refreshToken,
});

accessToken = oauth2Client.getAccessToken();

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    refreshToken = tokens.refresh_token;
    // store the refresh_token in my database!
  }

  accessToken = tokens.access_token;

  oauth2Client.setCredentials(tokens);
});

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: config.constants.mailer.transport.service,
          auth: {
            type: config.constants.mailer.transport.auth.type,
            user: config.env.SENDER_EMAIL_ADDRESS,
            clientId: config.env.MAILER_CLIENT_ID,
            clientSecret: config.env.MAILER_CLIENT_SECRET,
            refreshToken: config.env.MAILER_CLIENT_REFRESH_TOKEN,
            accessToken,
          },
        },
        defaults: {
          from: config.constants.default.mailer.from,
        },
        template: {
          dir: process.env.PWD + config.constants.mailer.dir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
