import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../user/user.decorator'
import { BankAccountService } from './bank-account.service'
import { BalanceDto } from './dto/balance.dto'
import { TransferDto } from './dto/transfer.dto'
import { UserCardsResponse } from './response/user-cards.response'

@ApiTags('Bank accounts')
@Controller('bank-accounts')
export class BankAccountController {
	constructor(private readonly bankAccountService: BankAccountService) {}

	@Get('get-user-cards')
	@Auth()
	@ApiResponse({
		status: 200,
		description: 'Login',
		type: UserCardsResponse
	})
	async getUserCards(@CurrentUser('id') id: number) {
		return this.bankAccountService.getUserCards(id)
	}

	@Get()
	@Auth()
	@ApiResponse({
		status: 200,
		description: 'Get all user`s bank accounts',
		isArray: true
	})
	async getAll(@CurrentUser('id') id: number) {
		return this.bankAccountService.getAll(id)
	}

	@Get(':id')
	@Auth()
	async getBankAccount(@Param('id') id: string) {
		return this.bankAccountService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createBankAccount(@CurrentUser('id') id: number) {
		return this.bankAccountService.create(id)
	}

	@HttpCode(200)
	@Post('create-card')
	@Auth()
	async createBankCard(@CurrentUser('id') id: number) {
		return this.bankAccountService.createCard(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('balance/top-up')
	@Auth()
	async topUpBalance(@CurrentUser('id') id: number, @Body() dto: BalanceDto) {
		return this.bankAccountService.topUpBalance(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('balance/withdrawal')
	@Auth()
	async withdrawalBalance(
		@CurrentUser('id') id: number,
		@Body() dto: BalanceDto
	) {
		return this.bankAccountService.withdrawalBalance(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('transfer-money')
	@Auth()
	async transferMoney(@Body() dto: TransferDto) {
		return this.bankAccountService.transferMoney(dto)
	}

	@HttpCode(200)
	@Delete(':number')
	@Auth()
	async deleteBankAccount(@Param('number') number: string) {
		return this.bankAccountService.delete(number)
	}
}
