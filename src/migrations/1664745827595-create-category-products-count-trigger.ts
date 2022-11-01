/* eslint-disable unicorn/filename-case */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryProductsCountTrigger1664745827595
  implements MigrationInterface
{
  name = 'createCategoryProductsCountTrigger1664745827595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_category_products_count() 
        RETURNS TRIGGER AS $update_category_products_count$
            BEGIN
                IF (TG_OP = 'UPDATE') THEN
                    UPDATE categories
                    SET products_count = products_count - 1
                    WHERE id = OLD.category_id;
                RETURN OLD;
                END IF;
            END;
        $update_category_products_count$ LANGUAGE plpgsql
        `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION category_products_count() 
        RETURNS TRIGGER AS $category_products_count$
            BEGIN
                IF (TG_OP = 'DELETE') THEN
                    UPDATE categories
                    SET products_count = products_count - 1 
                    WHERE id = OLD.category_id;
                RETURN OLD;
                ELSE
                    UPDATE categories
                    SET products_count = products_count + 1
                    WHERE id = NEW.category_id;
                RETURN NEW;
                END IF;
            END;
        $category_products_count$ LANGUAGE plpgsql
        `);
    await queryRunner.query(
      'CREATE TRIGGER update_category_products_count AFTER UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_category_products_count()',
    );
    await queryRunner.query(
      'CREATE TRIGGER category_products_count AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE PROCEDURE category_products_count()',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION update_category_products_count()');
  }
}
