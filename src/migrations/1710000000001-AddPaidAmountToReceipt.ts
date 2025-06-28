import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaidAmountToReceipt1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE receipts ADD COLUMN "paidAmount" DECIMAL(12,2) DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE receipts DROP COLUMN "paidAmount"`);
  }
} 