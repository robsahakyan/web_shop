import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTable1664745771498 implements MigrationInterface {
  name = 'createEventTable1664745771498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "name" character varying NOT NULL, 
                    CONSTRAINT "UQ_dfa3d03bef3f90f650fd138fb38" UNIQUE ("name"), 
                    CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" 
                ADD CONSTRAINT "FK_65c7821d2663e0fcb7d0f2ff565" FOREIGN KEY ("event_id") 
                REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "events"');
    await queryRunner.query(
      `ALTER TABLE "products" 
                DROP CONSTRAINT "FK_65c7821d2663e0fcb7d0f2ff565"`,
    );
  }
}
