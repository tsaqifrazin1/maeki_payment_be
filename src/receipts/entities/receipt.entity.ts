import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import ReceiptItem from './receiptItem.entity';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  receiptNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column('text')
  orderDetails: string;

  @OneToMany(() => ReceiptItem, (item) => item.receipt, { cascade: true, eager: true })
  items: ReceiptItem[];

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  paidAmount: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPaid: boolean;
} 