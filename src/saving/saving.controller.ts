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
import { Auth } from '../auth/decorators/auth.decorator'
import { PaginationDto } from '../dto/pagination.dto'
import { CurrentUser } from '../user/user.decorator'
import { SavingDto } from './saving.dto'
import { SavingService } from './saving.service'

@ApiTags('Savings')
@Controller('savings')
export class SavingController {
	constructor(private readonly savingService: SavingService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth()
	async getAllByCurrentUser(
		@CurrentUser('id') id: number,
		@Query() queryDto: PaginationDto
	) {
		return this.savingService.getAll(id, queryDto)
	}

	@Get(':id')
	@Auth()
	async getSaving(@Param('id') id: string) {
		return this.savingService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createSaving(@CurrentUser('id') id: number) {
		return this.savingService.create(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateSaving(@Param('id') id: string, @Body() dto: SavingDto) {
		return this.savingService.update(+id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteSaving(@Param('id') id: string) {
		return this.savingService.delete(+id)
	}
}
