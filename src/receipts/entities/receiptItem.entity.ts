import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity('receipt_items')
export class ReceiptItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receipt_id' })
  receipt: Receipt;

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  unitPrice: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;
}

export default ReceiptItem; 