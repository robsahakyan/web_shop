import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTable1664745764713 implements MigrationInterface {
  name = 'createCategoryTable1664745764713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "name" character varying NOT NULL, 
                    "products_count" integer NOT NULL, 
                    CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), 
                    CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" 
                ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") 
                REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "categories"');
    await queryRunner.query(
      `ALTER TABLE "products" 
            DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
  }
}
