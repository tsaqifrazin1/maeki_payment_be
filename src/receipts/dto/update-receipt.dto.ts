import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReceiptDto } from './create-receipt.dto';

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
} 