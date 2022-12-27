import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from './user.decorator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@Get('by-id/:id')
	@Auth()
	async getUser(@Param('id') id: string) {
		return this.userService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth()
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(+id, dto)
	}

	@HttpCode(200)
	@Patch('toggle-contact/:contactId')
	@Auth()
	async toggleContact(
		@CurrentUser('id') id: number,
		@Param('contactId') contactId: string
	) {
		return this.userService.toggleContact(id, +contactId)
	}

	@Get()
	async getUsers() {
		return this.userService.getAll()
	}

	@Get('contacts')
	@Auth()
	async getUserContacts(
		@CurrentUser('id') id: number,
		@Query('searchTerm') searchTerm?: string
	) {
		return this.userService.getContacts(id, searchTerm)
	}
}
