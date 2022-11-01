import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repostitory';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
