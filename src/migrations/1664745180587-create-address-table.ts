import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressTable1664745180587 implements MigrationInterface {
  name = 'createAddressTable1664745180587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."address_status_enum" AS ENUM('USER_OWN_ADDRESS', 
            'FOR_SHIPPING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" 
                    (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                        "address" character varying NOT NULL, 
                        "name" character varying NOT NULL, 
                        "city" character varying NOT NULL, 
                        "phone_number" character varying NOT NULL, 
                        "apartment" integer, 
                        "entrance" integer, 
                        "floor" integer, 
                        "intercom" integer, 
                        "user_id" uuid NOT NULL, 
                        "status" "public"."address_status_enum" NOT NULL DEFAULT 'USER_OWN_ADDRESS', 
                        CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")
                    )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35cd6c3fafec0bb5d072e24ea2" 
                ON "address" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "address" 
                ADD CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY ("user_id") 
                REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" 
                DROP CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20"`,
    );
    await queryRunner.query('DROP TABLE "address"');
    await queryRunner.query(
      'DROP INDEX "public"."IDX_35cd6c3fafec0bb5d072e24ea2"',
    );
    await queryRunner.query('DROP TYPE "public"."address_status_enum"');
  }
}
