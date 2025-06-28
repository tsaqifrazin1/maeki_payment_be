import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Receipt, ReceiptItem } from './entities';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
// import controller dan service setelah dibuat

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, ReceiptItem, Customer])],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {} 