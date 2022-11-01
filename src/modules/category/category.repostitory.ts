import { Repository } from "typeorm";

import { CustomRepository } from "../../db/typeorm-ex.decorator";
import { CategoryEntity } from "./category.entity";

@CustomRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async findByName(name: string): Promise<CategoryEntity | null> {
    const category = this.createQueryBuilder("category")
      .where("category.name = :name", { name })
      .getOne();

    return category;
  }

  async getAll(): Promise<CategoryEntity[] | null> {
    const category = this.createQueryBuilder("category").getMany();

    return category;
  }

  async getById(id: string): Promise<CategoryEntity | null> {
    const category = this.createQueryBuilder("category")
      .where("category.id = :categoryId", { categoryId: id })
      .getOne();

    return category;
  }
}
