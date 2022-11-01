import { Injectable } from '@nestjs/common';

import type { EventDto } from '../common/modules/event/event.dto';
import type { EventEntity } from './event.entity';
import { EventRepository } from './event.repostitory';
import { EventNotFoundException } from './exception/event-not-found.exception';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getByName(name: string): Promise<EventEntity> {
    const event = await this.eventRepository.findByName(name);

    if (!event) {
      throw new EventNotFoundException();
    }

    return event;
  }

  async getAll(): Promise<EventDto[]> {
    const events = await this.eventRepository.getAll();

    return events.map((event) => event.toDto());
  }

  async getById(id: string): Promise<EventDto> {
    const event = await this.eventRepository.getById(id);

    if (!event) {
      throw new EventNotFoundException();
    }

    return event.toDto();
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
