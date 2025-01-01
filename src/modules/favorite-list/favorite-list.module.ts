import { Module } from '@nestjs/common';
import { FavoriteListService } from './favorite-list.service';
import { FavoriteListController } from './favorite-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FavoriteList,
  FavoriteListSchema,
} from './schemas/favorite-list.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: FavoriteList.name, schema: FavoriteListSchema },
    ]),
  ],
  controllers: [FavoriteListController],
  providers: [FavoriteListService],
})
export class FavoriteListModule {}
