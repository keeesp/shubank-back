import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumTransactionStatus, EnumTransactionType } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { OrderByWithPagination } from '../dto/pagination.dto'
import { userOutput } from '../user/user.output'
import { TransactionDto } from './transaction.dto'

@Injectable()
export class TransactionService {
	constructor(private prisma: PrismaService) {}

	async byId(id: number) {
		const transaction = await this.prisma.transaction.findUnique({
			where: {
				id
			},
			include: {
				user: {
					select: userOutput
				},
				invoice: true
			}
		})

		if (!transaction) throw new NotFoundException('Transaction not found!')
		return transaction
	}

	async getAll(userId: number, dto: OrderByWithPagination) {
		const page = dto.page ? +dto.page : 1
		const perPage = dto.perPage ? +dto.perPage : 30

		const skip = (page - 1) * perPage

		const transactions = await this.prisma.transaction.findMany({
			where: { userId },
			skip,
			take: perPage,
			orderBy: {
				createdAt: dto.orderBy || 'desc'
			},
			include: {
				user: {
					select: userOutput
				},
				invoice: {
					include: {
						recipient: true
					}
				}
			}
		})

		return {
			transactions,
			length: await this.prisma.transaction.count({
				where: { userId }
			})
		}
	}

	async create(userId: number, dto: TransactionDto, amount?: number) {
		let invoiceField = {}
		let senderId = 2

		if (dto.invoice) {
			const invoice = await this.prisma.invoice.findUnique({
				where: { id: dto.invoice }
			})

			invoiceField = {
				connect: {
					id: dto.invoice
				}
			}
			amount = invoice.amount
			senderId = invoice.senderId
		}

		await this.prisma.transaction.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				status: EnumTransactionStatus.Complete,
				invoice: invoiceField,
				amount,
				type: dto.type || EnumTransactionType.WITHDRAWAL
			}
		})

		await this.prisma.transaction.create({
			data: {
				user: {
					connect: {
						id: senderId
					}
				},
				status: EnumTransactionStatus.Complete,
				invoice: invoiceField,
				amount,
				type: dto.type || EnumTransactionType.TOP_UP
			}
		})

		return { message: 'Success' }
	}

	async delete(id: number) {
		return this.prisma.transaction.delete({ where: { id } })
	}
}
