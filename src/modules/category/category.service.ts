import { Injectable } from '@nestjs/common';

import type { CategoryDto } from '../common/modules/category/category.dto';
import type { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repostitory';
import { CategoryNotFoundException } from './exception/category-not-found.exception';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findByName(name);

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }

  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.getAll();

    return categories.map((cat) => cat.toDto());
  }

  async getById(id: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.getById(id);

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category.toDto();
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
