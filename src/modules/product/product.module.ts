import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { CategoryModule } from '../category/category.module';
import { EventModule } from '../event/event.module';
import { TargetModule } from '../target/target.module';
import { UserModule } from '../user/user.module';
import { ImageRepository } from './image.repository';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { UserFavoriteRepository } from './user-favorite.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ProductRepository,
      ImageRepository,
      UserFavoriteRepository,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => EventModule),
    forwardRef(() => TargetModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
