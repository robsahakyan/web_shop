import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdmin1664751142542 implements MigrationInterface {
  name = 'createAdmin1664751142542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO users (email,password,full_name,role)
        VALUES('info@jpit.am','$2b$10$dQzaWxOzNa9PDvSLxWZruegp1QyH3TTxNxwVhIz08Ea8r8WBq/0Wu','admin','ADMIN')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM users WHERE email = 'info@jpit.am'");
  }
}
