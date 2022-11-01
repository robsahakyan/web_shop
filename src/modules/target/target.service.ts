import { Injectable } from '@nestjs/common';

import type { TargetDto } from '../common/modules/target/target.dto';
import { TargetNotFoundException } from './exception/target-not-found.exception';
import type { TargetEntity } from './target.entity';
import { TargetRepository } from './target.repostitory';

@Injectable()
export class TargetService {
  constructor(private readonly targetRepository: TargetRepository) {}

  async getByName(name: string): Promise<TargetEntity> {
    const target = await this.targetRepository.findByName(name);

    if (!target) {
      throw new TargetNotFoundException();
    }

    return target;
  }

  async getAll(): Promise<TargetDto[]> {
    const targets = await this.targetRepository.getAll();

    return targets.map((target) => target.toDto());
  }

  async getById(id: string): Promise<TargetDto> {
    try {
      const target = await this.targetRepository.getById(id);

      return target.toDto();
    } catch {
      throw new TargetNotFoundException();
    }
  }

  async remove(id: string): Promise<void> {
    await this.targetRepository.delete(id);
  }
}
