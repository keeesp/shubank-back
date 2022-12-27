import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from '../user/user.decorator'
import { EnumSortType, StatisticsService } from './statistics.service'

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('income/all')
	@Auth()
	getIncome(@CurrentUser('id') id: number) {
		return this.statisticsService.getIncome(id)
	}

	@Get('expense/all')
	@Auth()
	getExpense(@CurrentUser('id') id: number) {
		return this.statisticsService.getExpense(id)
	}

	@Get('income/dynamic')
	@Auth()
	getIncomeDynamic(
		@CurrentUser('id') id: number,
		@Query('type') type?: EnumSortType
	) {
		return this.statisticsService.getIncomeByDynamicWithCompare(id, type)
	}

	@Get('expense/dynamic')
	@Auth()
	getExpenseDynamic(
		@CurrentUser('id') id: number,
		@Query('type') type?: EnumSortType
	) {
		return this.statisticsService.getExpenseByDynamicWithCompare(id, type)
	}

	@Get('expense/categories')
	@Auth()
	getExpenseCategories(@CurrentUser('id') id: number) {
		return this.statisticsService.getExpenseCategories(id)
	}
}
