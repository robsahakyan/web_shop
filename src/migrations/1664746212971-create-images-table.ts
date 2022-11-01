import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImagesTable1664746212971 implements MigrationInterface {
  name = 'createImagesTable1664746212971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "images" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "name" character varying NOT NULL, 
                    "product_id" uuid, 
                    CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" 
                ADD CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d" FOREIGN KEY ("product_id") 
                REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" 
                DROP CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d"`,
    );
    await queryRunner.query('DROP TABLE "images"');
  }
}
