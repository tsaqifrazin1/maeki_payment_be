import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiptDto {
  @IsString()
  receiptNumber: string;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  paidAmount: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderDetails: string;
  items: {
    name: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }[];
} 