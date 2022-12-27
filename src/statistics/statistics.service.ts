import { Injectable } from '@nestjs/common'
import { EnumTransactionType } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

require('json-bigint-patch')

export enum EnumSortType {
	day = 'day',
	month = 'month'
}

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	async getIncome(userId: number) {
		const { _sum } = await this.prisma.transaction.aggregate({
			_sum: {
				amount: true
			},
			where: {
				userId,
				type: EnumTransactionType.TOP_UP
			}
		})

		const byDay = await this.prisma
			.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'Day') AS day, SUM(amount) AS amount FROM "Transaction" WHERE user_id = ${userId} AND type = 'TOP_UP' GROUP BY day ORDER BY day DESC`

		return { total: _sum.amount, byDay }
	}

	async getExpense(userId: number) {
		const { _sum } = await this.prisma.transaction.aggregate({
			_sum: {
				amount: true
			},
			where: {
				userId,
				type: EnumTransactionType.WITHDRAWAL
			}
		})

		const byDay = await this.prisma
			.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'Day') AS day, SUM(amount) AS amount FROM "Transaction" WHERE user_id = ${userId} AND type = 'WITHDRAWAL' GROUP BY day ORDER BY day DESC`

		return { total: _sum.amount, byDay }
	}

	async getIncomeByDynamicWithCompare(userId: number, type = EnumSortType.day) {
		return type === EnumSortType.month
			? this.prisma
					.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Month') AS date,
    SUM(amount) AS amount, floor(random()*(1500-10+1))+300 as previous_amount
    FROM "Transaction" WHERE user_id = ${userId} AND type = 'TOP_UP' GROUP BY date ORDER BY date DESC`
			: this.prisma
					.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'Day') AS date,
    SUM(amount) AS amount, floor(random()*(400-10+1))+20 as previous_amount
    FROM "Transaction" WHERE user_id = ${userId} AND type = 'TOP_UP' GROUP BY date ORDER BY date DESC`

		/* SELECT
  (
    SELECT
      SUM(amount)
    FROM
      "Transaction"
    WHERE
      date_trunc('day', created_at) = date_trunc('day', created_at - INTERVAL '7 day')
  ) as previous_amount */
	}

	async getExpenseByDynamicWithCompare(
		userId: number,
		type = EnumSortType.day
	) {
		return type === EnumSortType.month
			? this.prisma
					.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Month') AS date,
    SUM(amount) AS amount, floor(random()*(1500-10+1))+300 as previous_amount
    FROM "Transaction" WHERE user_id = ${userId} AND type = 'WITHDRAWAL' GROUP BY date ORDER BY date DESC`
			: this.prisma
					.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'Day') AS date,
    SUM(amount) AS amount, floor(random()*(400-10+1))+20 as previous_amount
    FROM "Transaction" WHERE user_id = ${userId} AND type = 'WITHDRAWAL' GROUP BY date ORDER BY date DESC`
	}

	async getExpenseCategories(userId: number) {
		const itemsByName = await this.prisma.invoice.findMany({
			// where: { recipientId: userId },
			select: {
				items: {
					select: {
						name: true,
						amount: true
					}
				}
			}
		})

		const result = itemsByName.reduce((acc, invoice) => {
			invoice.items.forEach(item => {
				if (!acc[item.name]) {
					acc[item.name] = 0
				}
				acc[item.name] += item.amount
			})
			return acc
		}, {})

		return result
	}
}
