import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/user.decorator'
import { PaginationDto } from '../dto/pagination.dto'
import { InvoiceDto } from './dto/invoice.dto'
import { InvoiceService } from './invoice.service'

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth()
	async getAllByCurrentUser(
		@CurrentUser('id') id: number,
		@Query() queryDto: PaginationDto
	) {
		return this.invoiceService.getAll(id, queryDto)
	}

	@Get('by-recipient')
	@Auth()
	async getByRecipient(@CurrentUser('id') id: number) {
		return this.invoiceService.getByRecipient(id)
	}

	@Get('by-sender')
	@Auth()
	async getBySender(@CurrentUser('id') id: number) {
		return this.invoiceService.getBySender(id)
	}

	@Get('statistics')
	@Auth()
	async getStatistics(@CurrentUser('id') id: number) {
		return this.invoiceService.getStatistics(id)
	}

	@Get(':id')
	@Auth()
	async getInvoice(@Param('id') id: string) {
		return this.invoiceService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createInvoice(@CurrentUser('id') id: number) {
		return this.invoiceService.create(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateInvoice(@Param('id') id: string, @Body() dto: InvoiceDto) {
		return this.invoiceService.update(+id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteInvoice(@Param('id') id: string) {
		return this.invoiceService.delete(+id)
	}
}
