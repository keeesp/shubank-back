import { Injectable, NotFoundException } from '@nestjs/common'
import {
	EnumCardType,
	EnumTransactionStatus,
	EnumTransactionType
} from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { userOutput } from 'src/user/user.output'
import { generateCardNumberAndSystem } from 'src/utils/bank/generate-bank-card-number'
import { getRandomBankName } from 'src/utils/bank/get-random-bank-name'
import { getRandomNumber } from 'src/utils/random-number'
import { TransactionService } from '../transaction/transaction.service'
import { generateExpiryDate } from '../utils/bank/generate-expire-date'
import { BalanceDto } from './dto/balance.dto'
import { TransferDto } from './dto/transfer.dto'

@Injectable()
export class BankAccountService {
	constructor(
		private prisma: PrismaService,
		private transactionService: TransactionService
	) {}

	async byId(id: number) {
		const bankAccount = await this.prisma.bankAccount.findUnique({
			where: {
				id
			},
			include: {
				saving: true,
				card: true,
				user: {
					select: userOutput
				}
			}
		})

		if (!bankAccount) throw new NotFoundException('Bank account not found!')
		return bankAccount
	}

	async getAll(userId: number) {
		return this.prisma.bankAccount.findMany({
			where: { userId },
			orderBy: [
				{
					createdAt: 'desc'
				}
			],
			include: {
				saving: true,
				card: true,
				user: { select: userOutput }
			}
		})
	}

	async create(userId: number) {
		const bankAccountNumber = getRandomNumber(100000000, 999999999).toString()

		const bankAccount = await this.prisma.bankAccount.create({
			data: {
				number: bankAccountNumber,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return bankAccount.id
	}

	async createCard(userId: number) {
		const newBankAccountId = await this.create(userId)

		const { number, paymentSystem } = generateCardNumberAndSystem()
		const cvc = getRandomNumber(100, 999)
		const expireDate = generateExpiryDate()
		const bankName = getRandomBankName()

		const isHasUserCard = await this.prisma.bankAccount.findMany({
			where: {
				user: { id: userId },
				card: {
					isNot: null
				}
			}
		})

		const type: EnumCardType = isHasUserCard.length ? 'secondary' : 'primary'

		const card = await this.prisma.bankCard.create({
			data: {
				bankAccount: {
					connect: {
						id: newBankAccountId
					}
				},
				bankName,
				expireDate,
				cvc,
				number,
				paymentSystem,
				type
			}
		})

		return card
	}

	async getUserCards(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				bankAccounts: {
					select: {
						balance: true,
						number: true,
						card: true
					}
				}
			}
		})

		return user.bankAccounts
			.filter(account => account.card)
			.map(account => ({
				...account.card,
				balance: account.balance,
				accountNumber: account.number
			}))
	}

	async delete(id: number) {
		return this.prisma.bankAccount.delete({ where: { id } })
	}

	async topUpBalance(userId: number, { accountNumber, amount }: BalanceDto) {
		return this.prisma.bankAccount.updateMany({
			where: {
				userId,
				number: accountNumber
			},

			data: {
				balance: { increment: amount }
			}
		})
	}

	async withdrawalBalance(
		userId: number,
		{ accountNumber, amount }: BalanceDto
	) {
		return this.prisma.bankAccount.updateMany({
			where: {
				userId,
				number: accountNumber
			},

			data: {
				balance: { decrement: amount }
			}
		})
	}

	async transferMoney(dto: TransferDto) {
		const senderAccount = await this.prisma.bankAccount.findUnique({
			where: {
				number: dto.fromAccountId
			},
			include: {
				user: {
					select: userOutput
				}
			}
		})

		const recipientAccount = await this.prisma.bankAccount.findUnique({
			where: {
				number: dto.toAccountId
			},
			include: {
				user: {
					select: userOutput
				}
			}
		})

		await this.prisma.bankAccount.update({
			where: {
				number: dto.fromAccountId
			},

			data: {
				balance: { decrement: dto.amount }
			}
		})

		await this.prisma.bankAccount.update({
			where: {
				number: dto.toAccountId
			},

			data: {
				balance: { increment: dto.amount }
			}
		})

		await this.transactionService.create(
			senderAccount.userId,
			{
				type: EnumTransactionType.TOP_UP,
				status: EnumTransactionStatus.Complete
			},
			dto.amount
		)

		await this.transactionService.create(
			recipientAccount.userId,
			{
				type: EnumTransactionType.WITHDRAWAL,
				status: EnumTransactionStatus.Complete
			},
			dto.amount
		)

		return { message: 'Success' }
	}
}
