import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPaidToReceipt1749322567150 implements MigrationInterface {
    name = 'AddIsPaidToReceipt1749322567150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipts" ADD "isPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "isPaid"`);
    }

}
