import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { InvoiceController } from './invoice.controller'
import { InvoiceService } from './invoice.service'

@Module({
	controllers: [InvoiceController],
	providers: [InvoiceService, PrismaService]
})
export class InvoiceModule {}
