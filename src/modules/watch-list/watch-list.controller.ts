import { Controller } from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { ROUTES } from 'src/constants/route';

@Controller(ROUTES.WATCHLIST)
export class WatchListController {
  constructor(private readonly watchListService: WatchListService) {}
}
