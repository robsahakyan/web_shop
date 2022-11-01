import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactsTable1664746722249 implements MigrationInterface {
  name = 'createContactsTable1664746722249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contacts" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "email" character varying NOT NULL, 
                    "description" character varying NOT NULL, 
                    "message" text NOT NULL, 
                    CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id")
                )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "contacts"');
  }
}
