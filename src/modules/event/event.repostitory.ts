import { Repository } from "typeorm";

import { CustomRepository } from "../../db/typeorm-ex.decorator";
import { EventEntity } from "./event.entity";

@CustomRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {
  async findByName(name: string): Promise<EventEntity | null> {
    const event = this.createQueryBuilder("event")
      .where("event.name = :name", { name })
      .getOne();

    return event;
  }

  async getAll(): Promise<EventEntity[] | null> {
    const event = this.createQueryBuilder("event").getMany();

    return event;
  }

  async getById(id: string): Promise<EventEntity | null> {
    const event = this.createQueryBuilder("event")
      .where("event.id = :eventId", { eventId: id })
      .getOne();

    return event;
  }
}
