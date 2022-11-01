import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritesTable1664746322278 implements MigrationInterface {
  name = 'createFavoritesTable1664746322278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" 
                (  
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "user_id" uuid NOT NULL, 
                    "product_id" uuid NOT NULL, 
                    CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35a6b05ee3b624d0de01ee5059" 
                ON "favorites" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_003e599a9fc0e8f154b6313639" 
                ON "favorites" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" 
                ADD CONSTRAINT "FK_003e599a9fc0e8f154b6313639f" FOREIGN KEY ("product_id") 
                REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" 
                ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") 
                REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" 
                DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" 
                DROP CONSTRAINT "FK_003e599a9fc0e8f154b6313639f"`,
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_35a6b05ee3b624d0de01ee5059"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_003e599a9fc0e8f154b6313639"',
    );
    await queryRunner.query('DROP TABLE "favorites"');
  }
}
