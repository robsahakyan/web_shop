import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { ImageEntity } from './image.entity';

@CustomRepository(ImageEntity)
export class ImageRepository extends Repository<ImageEntity> {
  async findById(id: string): Promise<ImageEntity | null> {
    return this.findOne({ where: { id } });
  }
}
