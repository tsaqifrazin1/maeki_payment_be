import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Receipt } from './entities/receipt.entity';
import { ReceiptItem } from './entities/receiptItem.entity';

interface CreateReceiptItemDto {
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}


@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptsRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemsRepository: Repository<ReceiptItem>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  private async generateReceiptNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    // Get the latest receipt number for today
    const latestReceipt = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .where('receipt.receiptNumber LIKE :prefix', {
        prefix: `INV/${year}${month}${day}/%`,
      })
      .orderBy('receipt.receiptNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (latestReceipt) {
      const lastSequence = parseInt(
        latestReceipt.receiptNumber.split('/').pop() || '0',
      );
      sequence = lastSequence + 1;
    }

    return `INV/${year}${month}${day}/${String(sequence).padStart(4, '0')}`;
  }

  async create(createReceiptDto: CreateReceiptDto, user: User): Promise<Receipt> {
    // Cari customer berdasarkan email
    let customer = await this.customersRepository.findOne({
      where: { email: createReceiptDto.customerEmail },
    });

    // Jika customer tidak ditemukan, buat customer baru
    if (!customer) {
      customer = this.customersRepository.create({
        name: createReceiptDto.customerName,
        email: createReceiptDto.customerEmail,
        phone: createReceiptDto.customerPhone,
        address: createReceiptDto.customerAddress,
      });
      await this.customersRepository.save(customer);
    }

    const receiptNumber = await this.generateReceiptNumber();

    // Buat nota baru
    const receipt = this.receiptsRepository.create({
      customer,
      orderDetails: createReceiptDto.orderDetails,
      date: createReceiptDto.date,
      totalAmount: createReceiptDto.items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      ),
      paidAmount: createReceiptDto.paidAmount || 0,
      receiptNumber,
      token: crypto.randomBytes(16).toString('hex'),
      createdBy: user,
      isPaid: createReceiptDto.isPaid || false,
    });

    const savedReceipt = await this.receiptsRepository.save(receipt);

    // Buat item-item nota
    const receiptItems = createReceiptDto.items.map((item) =>
      this.receiptItemsRepository.create({
        receipt: savedReceipt,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.unitPrice * item.quantity,
      }),
    );

    await this.receiptItemsRepository.save(receiptItems);

    return this.findOne(savedReceipt.id);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10,
    search?: string
  ): Promise<{ data: Receipt[], total: number, page: number, lastPage: number }> {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.receiptsRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.customer', 'customer')
      .leftJoinAndSelect('receipt.items', 'items');

    if (search) {
      queryBuilder.where(
        '(receipt.receiptNumber ILIKE :search OR customer.name ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('receipt.date', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const lastPage = Math.ceil(total / limit);

    return { data, total, page, lastPage };
  }

  async findOne(id: number): Promise<Receipt> {
    const receipt = await this.receiptsRepository.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });

    if (!receipt) {
      throw new NotFoundException(`Receipt with ID ${id} not found`);
    }

    return receipt;
  }

  async update(
    id: number,
    updateReceiptDto: UpdateReceiptDto,
  ): Promise<Receipt> {
    await this.receiptsRepository.update(id, updateReceiptDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const receipt = await this.findOne(id);
    await this.receiptsRepository.remove(receipt);
  }

  async getDailyPayments(year: string, month: string, weekNumber?: string) {
    const selectedYear = parseInt(year);
    const selectedMonth = parseInt(month) - 1; // Month is 0-indexed in Date object

    let startDate: Date;
    let endDate: Date;

    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    let firstMondayOfContainingWeek = new Date(firstDayOfMonth);
    const dayOfWeek = firstMondayOfContainingWeek.getDay(); // 0-Minggu, 1-Senin, ..., 6-Sabtu
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    firstMondayOfContainingWeek.setDate(firstMondayOfContainingWeek.getDate() - diffToMonday);

    const weekNum = weekNumber ? parseInt(weekNumber) : 1; // Default ke minggu 1 jika tidak disediakan

    startDate = new Date(firstMondayOfContainingWeek);
    startDate.setDate(startDate.getDate() + (weekNum - 1) * 7);

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const receipts = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .select('DATE(receipt.date)', 'date') // Pilih tanggal aktual
      .addSelect('EXTRACT(DOW FROM receipt.date)', 'dayOfWeek') // 0 (Minggu) hingga 6 (Sabtu)
      .addSelect('SUM(receipt.totalAmount)', 'total')
      .where('receipt.date >= :startDate', { startDate })
      .andWhere('receipt.date <= :endDate', { endDate })
      .groupBy('DATE(receipt.date)') // Group berdasarkan tanggal
      .addGroupBy('EXTRACT(DOW FROM receipt.date)') // Juga group berdasarkan DOW
      .orderBy('DATE(receipt.date)', 'ASC') // Urutkan berdasarkan tanggal
      .getRawMany();

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Buat array untuk 7 hari dalam minggu yang dipilih, diinisialisasi dengan nilai default
    const dailyData: { date: string, day: string, total: number }[] = [];
    let tempDate = new Date(startDate); // Mulai dari startDate yang dihitung

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(tempDate);
      const dayIndex = currentDay.getDay(); // 0-Minggu, 1-Senin, ..., 6-Sabtu

      dailyData.push({
        date: currentDay.toISOString().split('T')[0], // Format YYYY-MM-DD
        day: dayNames[dayIndex],
        total: 0,
      });
      tempDate.setDate(tempDate.getDate() + 1); // Pindah ke hari berikutnya
    }

    // Isi dailyData dengan pembayaran yang diambil
    receipts.forEach((item) => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      const foundDay = dailyData.find(d => d.date === itemDate);
      if (foundDay) {
        foundDay.total = Number(item.total);
      }
    });

    return dailyData;
  }

  async getMonthlyTransactions(year: string, month: string) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const totalTransactions = await this.receiptsRepository
      .createQueryBuilder('receipt')
      .where('receipt.date >= :startDate', { startDate })
      .andWhere('receipt.date <= :endDate', { endDate })
      .getCount();

    return totalTransactions;
  }
}
