import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROUTES } from '../../constants/route';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
