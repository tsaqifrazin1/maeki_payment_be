import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenToReceipt1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE receipts ADD COLUMN token VARCHAR(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE receipts DROP COLUMN token`);
  }
} 