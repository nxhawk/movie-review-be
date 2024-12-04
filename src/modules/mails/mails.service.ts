import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string;
    from: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    try {
      return this.mailerService.sendMail({
        to: options.to,
        from: options.from,
        subject: options.subject,
        template: options.template,
        context: {
          name: options.context.name,
          verifyEmailUrl: options.context.verifyEmailUrl,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email');
    }
  }
}
