import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749300682965 implements MigrationInterface {
    name = 'InitialMigration1749300682965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt_items" DROP CONSTRAINT "FK_receipt_items_receipt"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_receipts_customer"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_receipts_created_by"`);
        await queryRunner.query(`ALTER TABLE "receipt_items" RENAME COLUMN "unit_price" TO "unitPrice"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "UQ_receipts_receipt_number"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "receipt_number"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "order_details"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "receiptNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "UQ_ae91d6f7ca67ed5bf73177430d7" UNIQUE ("receiptNumber")`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "orderDetails" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "receipt_items" ADD CONSTRAINT "FK_9f35634152710322f0296938400" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "FK_733f8febc9bbf9605f7c72b2d31" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "FK_a8590867edda0c86986b022c090" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_a8590867edda0c86986b022c090"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_733f8febc9bbf9605f7c72b2d31"`);
        await queryRunner.query(`ALTER TABLE "receipt_items" DROP CONSTRAINT "FK_9f35634152710322f0296938400"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "orderDetails"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "UQ_ae91d6f7ca67ed5bf73177430d7"`);
        await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "receiptNumber"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "order_details" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "customer_id" integer`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD "receipt_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "UQ_receipts_receipt_number" UNIQUE ("receipt_number")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipt_items" RENAME COLUMN "unitPrice" TO "unit_price"`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "FK_receipts_created_by" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "FK_receipts_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipt_items" ADD CONSTRAINT "FK_receipt_items_receipt" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
