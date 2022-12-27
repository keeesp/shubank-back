import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'
import { AuthService } from './auth.service'
import { RefreshTokenDto } from './refresh-token.dto'

class UserFields {
	@ApiProperty()
	id: number
	@ApiProperty()
	email: string
}

class ReturnAuthFields {
	@ApiProperty()
	refreshToken: string
	@ApiProperty()
	accessToken: string
	@ApiProperty()
	user: UserFields
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	@ApiResponse({
		status: 200,
		description: 'Login',
		type: ReturnAuthFields
	})
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	@ApiResponse({
		status: 200,
		description: 'Login',
		type: ReturnAuthFields
	})
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	@ApiResponse({
		status: 200,
		description: 'Login',
		type: ReturnAuthFields
	})
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}
}
