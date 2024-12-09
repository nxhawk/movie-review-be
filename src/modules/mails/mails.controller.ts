import { Controller } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ROUTES } from '../../constants/route';

@Controller(ROUTES.MAILS)
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}
}
