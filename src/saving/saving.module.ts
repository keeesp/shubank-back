import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { BankAccountService } from '../bank-account/bank-account.service'
import { TransactionService } from '../transaction/transaction.service'
import { SavingController } from './saving.controller'
import { SavingService } from './saving.service'

@Module({
	controllers: [SavingController],
	providers: [
		SavingService,
		PrismaService,
		BankAccountService,
		TransactionService
	]
})
export class SavingModule {}
