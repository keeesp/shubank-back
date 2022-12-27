import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { BankAccountService } from '../bank-account/bank-account.service'
import { PaginationDto } from '../dto/pagination.dto'
import { userOutput } from '../user/user.output'
import { SavingDto } from './saving.dto'

@Injectable()
export class SavingService {
	constructor(
		private prisma: PrismaService,
		private bankAccountService: BankAccountService
	) {}

	async byId(id: number) {
		const saving = await this.prisma.saving.findUnique({
			where: {
				id
			},
			include: {
				bankAccount: true,
				user: { select: userOutput }
			}
		})

		if (!saving) throw new NotFoundException('Saving not found!')
		return saving
	}

	async getAll(userId: number, dto: PaginationDto) {
		const page = dto.page ? +dto.page : 1
		const perPage = dto.perPage ? +dto.perPage : 30

		const skip = (page - 1) * perPage

		return this.prisma.saving.findMany({
			where: { userId },
			skip,
			take: perPage,
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				bankAccount: true,
				user: {
					select: {
						contacts: true,
						email: true,
						id: true,
						name: true,
						avatarPath: true,
						address: true,
						password: false
					}
				}
			}
		})
	}

	async create(userId: number) {
		const newBankAccountId = await this.bankAccountService.create(userId)

		const saving = await this.prisma.saving.create({
			data: {
				color: '',
				name: '',
				bankAccount: {
					connect: {
						id: newBankAccountId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return saving.id
	}

	async update(id: number, dto: SavingDto) {
		return this.prisma.saving.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: number) {
		return this.prisma.saving.delete({ where: { id } })
	}
}
