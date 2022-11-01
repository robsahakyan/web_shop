import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1664745149623 implements MigrationInterface {
  name = 'createUsersTable1664745149623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_tokens_type_enum" AS ENUM('VERIFY_ACCOUNT', 
            'FORGOT_PASSWORD', 'AUTH', 'REFRESH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_tokens" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "user_id" character varying NOT NULL, 
                    "token" character varying NOT NULL, 
                    "type" "public"."users_tokens_type_enum" NOT NULL, 
                    CONSTRAINT "UQ_16796eb52a059007e7e4f5fa72e" UNIQUE ("token"), 
                    CONSTRAINT "UQ_c7178ae495d0ae58b04304a54c2" UNIQUE ("user_id", "type"), 
                    CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id")
                )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_16796eb52a059007e7e4f5fa72" ON 
            "users_tokens" ("token") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 
            'CUSTOMER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 
            'FEMALE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 
            'BLOCKED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "phone" character varying, 
                    "email" character varying NOT NULL, 
                    "full_name" character varying NOT NULL, 
                    "password" character varying NOT NULL, 
                    "role" "public"."users_role_enum" NOT NULL, 
                    "birthday" TIMESTAMP, 
                    "gender" "public"."users_gender_enum", 
                    "image" character varying, 
                    "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', 
                    CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), 
                    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_35cd6c3fafec0bb5d072e24ea2"',
    );
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_status_enum"');
    await queryRunner.query('DROP TYPE "public"."users_gender_enum"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
    await queryRunner.query(
      'DROP INDEX "public"."IDX_16796eb52a059007e7e4f5fa72"',
    );
    await queryRunner.query('DROP TABLE "users_tokens"');
    await queryRunner.query('DROP TYPE "public"."users_tokens_type_enum"');
  }
}
