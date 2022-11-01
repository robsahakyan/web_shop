import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTargetTable1664745777709 implements MigrationInterface {
  name = 'createTargetTable1664745777709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "targets" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "name" character varying NOT NULL, 
                    CONSTRAINT "UQ_0027e2dfa88fd4d85a382976ec0" UNIQUE ("name"), 
                    CONSTRAINT "PK_87084f49e9de9dd6a3e83906584" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" 
                ADD CONSTRAINT "FK_b5918b13e7d0f78fd1ea4214bf5" FOREIGN KEY ("target_id") 
                REFERENCES "targets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "targets"');
    await queryRunner.query(
      `ALTER TABLE "products" 
                DROP CONSTRAINT "FK_b5918b13e7d0f78fd1ea4214bf5"`,
    );
  }
}
