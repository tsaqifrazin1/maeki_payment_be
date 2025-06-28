import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReceiptDto: CreateReceiptDto, @Req() req) {
    return this.receiptsService.create(createReceiptDto, req.user as User);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.receiptsService.findAll(page, limit, search);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
    const receipt = await this.receiptsService.findOne(+id);
    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }
    if (receipt.isPaid) {
      throw new BadRequestException('Cannot update paid receipt');
    }
    return this.receiptsService.update(+id, updateReceiptDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.receiptsService.remove(+id);
  }

  @Get('daily-payments')
  async getDailyPayments(
    @Query('year') year: string = new Date().getFullYear().toString(),
    @Query('month') month: string = (new Date().getMonth() + 1).toString(),
    @Query('weekNumber') weekNumber?: string,
  ) {
    return this.receiptsService.getDailyPayments(year, month, weekNumber);
  }

  @Get('monthly-transactions')
  async getMonthlyTransactions(
    @Query('year') year: string = new Date().getFullYear().toString(),
    @Query('month') month: string = (new Date().getMonth() + 1).toString()
  ) {
    return this.receiptsService.getMonthlyTransactions(year, month);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Query('token') token?: string) {
    const receipt = await this.receiptsService.findOne(id);
    if (receipt?.token !== token) {
      throw new NotFoundException('Receipt not found');
    }
    return receipt;
  }
}
