import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1709123456789 implements MigrationInterface {
    name = 'CreateInitialTables1709123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'admin',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_username" UNIQUE ("username"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Create customers table
        await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying,
                "email" character varying,
                "address" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_customers" PRIMARY KEY ("id")
            )
        `);

        // Create receipts table
        await queryRunner.query(`
            CREATE TABLE "receipts" (
                "id" SERIAL NOT NULL,
                "receipt_number" character varying NOT NULL,
                "customer_id" integer,
                "order_details" text NOT NULL,
                "amount" decimal(12,2) NOT NULL,
                "date" TIMESTAMP NOT NULL,
                "created_by_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_receipts_receipt_number" UNIQUE ("receipt_number"),
                CONSTRAINT "PK_receipts" PRIMARY KEY ("id"),
                CONSTRAINT "FK_receipts_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_receipts_created_by" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

        // Create receipt_items table
        await queryRunner.query(`
            CREATE TABLE "receipt_items" (
                "id" SERIAL NOT NULL,
                "receipt_id" integer,
                "name" character varying NOT NULL,
                "unit_price" decimal(12,2) NOT NULL,
                "quantity" integer NOT NULL,
                "total" decimal(12,2) NOT NULL,
                CONSTRAINT "PK_receipt_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_receipt_items_receipt" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "receipt_items"`);
        await queryRunner.query(`DROP TABLE "receipts"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 