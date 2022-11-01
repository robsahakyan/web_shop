import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1664745730318 implements MigrationInterface {
  name = 'createProductsTable1664745730318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_show_enum" AS ENUM('true', 
            'false')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "name" character varying NOT NULL, 
                    "name_ru" character varying, 
                    "name_en" character varying, 
                    "code" integer NOT NULL, 
                    "description" character varying, 
                    "description_ru" character varying, 
                    "description_en" character varying, 
                    "price" integer NOT NULL, 
                    "from_age" integer, 
                    "to_age" integer, 
                    "views_count" integer NOT NULL DEFAULT '0', 
                    "show" "public"."products_show_enum" NOT NULL DEFAULT 'false', 
                    "stock" integer NOT NULL, 
                    "category_id" uuid, "event_id" uuid, 
                    "target_id" uuid, 
                    CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code"), 
                    CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
                    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "products"');
    await queryRunner.query('DROP TYPE "public"."products_show_enum"');
  }
}
