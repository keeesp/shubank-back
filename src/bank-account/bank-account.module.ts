import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TransactionService } from 'src/transaction/transaction.service'
import { BankAccountController } from './bank-account.controller'
import { BankAccountService } from './bank-account.service'
// 1
@Module({
	controllers: [BankAccountController],
	providers: [BankAccountService, PrismaService, TransactionService],
	exports: [BankAccountService]
})
export class BankAccountModule {}
