import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReceiptEntity1749324027067 implements MigrationInterface {
    name = 'UpdateReceiptEntity1749324027067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add the new column 'totalAmount' as nullable
        await queryRunner.query(`ALTER TABLE "receipts" ADD "totalAmount" numeric(12,2)`);

        // Step 2: Update existing rows to set a default value for 'totalAmount'
        // This is crucial to avoid the 'contains null values' error.
        // Assuming 0 is an acceptable default for existing entries without an amount.
        // If you had a way to derive it from old 'amount' column, it would be here.
        await queryRunner.query(`UPDATE "receipts" SET "totalAmount" = 0 WHERE "totalAmount" IS NULL`);

        // Step 3: Alter the 'totalAmount' column to be NOT NULL
        await queryRunner.query(`ALTER TABLE "receipts" ALTER COLUMN "totalAmount" SET NOT NULL`);

        // Step 4: Drop the old 'amount' column
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "amount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse Step 4: Add back the old 'amount' column as NOT NULL with a default
        await queryRunner.query(`ALTER TABLE "receipts" ADD "amount" numeric(12,2) NOT NULL DEFAULT 0`);

        // Reverse Step 3: Drop the 'totalAmount' column
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "totalAmount"`);
    }

}
