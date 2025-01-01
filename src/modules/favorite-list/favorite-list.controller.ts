import { Controller } from '@nestjs/common';
import { FavoriteListService } from './favorite-list.service';
import { ROUTES } from 'src/constants/route';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorite List')
@ApiBearerAuth()
@Controller(ROUTES.FAVORITELIST)
export class FavoriteListController {
  constructor(private readonly favoriteListService: FavoriteListService) {}
}
