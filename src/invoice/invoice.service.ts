import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumTransactionStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { PaginationDto } from '../dto/pagination.dto'
import { userOutput } from '../user/user.output'
import { InvoiceDto } from './dto/invoice.dto'

@Injectable()
export class InvoiceService {
	constructor(private prisma: PrismaService) {}

	async byId(id: number) {
		const invoice = await this.prisma.invoice.findUnique({
			where: {
				id
			},
			include: {
				items: true,
				files: true,
				recipient: {
					select: userOutput
				},
				sender: {
					select: userOutput
				}
			}
		})

		if (!invoice) throw new NotFoundException('Invoice not found!')
		return invoice
	}

	async getAll(userId: number, dto: PaginationDto) {
		const page = dto.page ? +dto.page : 1
		const perPage = dto.perPage ? +dto.perPage : 30

		const skip = (page - 1) * perPage

		return this.prisma.invoice.findMany({
			where: { OR: [{ senderId: userId }, { recipientId: userId }] },
			skip,
			take: perPage,
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: true,
				files: true,
				recipient: {
					select: userOutput
				},
				sender: {
					select: userOutput
				},
				transactions: true
			}
		})
	}

	async getByRecipient(recipientId: number) {
		return this.prisma.invoice.findMany({
			where: { recipientId },
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: true,
				files: true,
				recipient: {
					select: userOutput
				},
				sender: {
					select: userOutput
				},
				transactions: true
			}
		})
	}

	async getBySender(senderId: number) {
		return this.prisma.invoice.findMany({
			where: { senderId },
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: true,
				files: true,
				recipient: {
					select: userOutput
				},
				sender: {
					select: userOutput
				},
				transactions: true
			}
		})
	}

	async create(userId: number) {
		const invoice = await this.prisma.invoice.create({
			data: {
				amount: 0,
				sender: {
					connect: {
						id: userId
					}
				}
			}
		})

		return invoice.id
	}

	async update(id: number, dto: InvoiceDto) {
		return this.prisma.invoice.update({
			where: {
				id
			},
			data: {
				amount: dto.amount,

				recipient: {
					connect: {
						id: dto.recipient
					}
				},

				items: {
					create: dto.items
				},

				files: {
					create: dto.files
				}
			}
		})
	}

	async delete(id: number) {
		return this.prisma.invoice.delete({ where: { id } })
	}

	async getStatistics(userId: number) {
		const sent = await this.prisma.invoice.count({
			where: { senderId: userId }
		})

		const paid = await this.prisma.invoice
			.findMany({
				where: {
					recipientId: userId,
					transactions: {
						every: { status: EnumTransactionStatus.Complete }
					}
				},
				include: {
					transactions: true
				}
			})
			.then(data => data.filter(data => data.transactions.length).length)

		const pending = await this.prisma.invoice
			.findMany({
				where: {
					recipientId: userId
				},
				include: {
					transactions: true
				}
			})
			.then(data => data.filter(data => !data.transactions.length).length)

		const unpaid = 0

		return {
			sent,
			paid,
			pending,
			unpaid
		}
	}
}
