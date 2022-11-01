import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { EventController } from './event.controller';
import { EventRepository } from './event.repostitory';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([EventRepository])],
  controllers: [EventController],
  exports: [EventService],
  providers: [EventService],
})
export class EventModule {}
