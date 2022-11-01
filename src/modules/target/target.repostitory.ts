import { Repository } from "typeorm";

import { CustomRepository } from "../../db/typeorm-ex.decorator";
import { TargetEntity } from "./target.entity";

@CustomRepository(TargetEntity)
export class TargetRepository extends Repository<TargetEntity> {
  async findByName(name: string): Promise<TargetEntity | null> {
    const target = this.createQueryBuilder("target")
      .where("target.name = :name", { name })
      .getOne();

    return target;
  }

  async getAll(): Promise<TargetEntity[] | null> {
    const target = this.createQueryBuilder("target").getMany();

    return target;
  }

  async getById(id: string): Promise<TargetEntity | null> {
    const target = this.createQueryBuilder("target")
      .where("target.id = :targetId", { targetId: id })
      .getOne();

    return target;
  }
}
