import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { TargetController } from './target.controller';
import { TargetRepository } from './target.repostitory';
import { TargetService } from './target.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TargetRepository])],
  controllers: [TargetController],
  exports: [TargetService],
  providers: [TargetService],
})
export class TargetModule {}
