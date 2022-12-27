import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { BankAccountModule } from './bank-account/bank-account.module'
import { InvoiceModule } from './invoice/invoice.module'
import { MediaModule } from './media/media.module'
import { SavingModule } from './saving/saving.module'
import { StatisticsModule } from './statistics/statistics.module'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		MediaModule,
		BankAccountModule,
		SavingModule,
		InvoiceModule,
		TransactionModule,
		StatisticsModule
	]
})
export class AppModule {}
