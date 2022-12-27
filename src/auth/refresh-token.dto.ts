import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@ApiProperty()
	@IsString({
		message: 'You did not pass refresh token or it is not a string!'
	})
	refreshToken: string
}
