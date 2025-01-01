import { Module } from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { WatchListController } from './watch-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchList, WatchListSchema } from './schemas/watch-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WatchList.name, schema: WatchListSchema },
    ]),
  ],
  controllers: [WatchListController],
  providers: [WatchListService],
})
export class WatchListModule {}
