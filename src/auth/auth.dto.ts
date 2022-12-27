import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@ApiProperty()
	@IsEmail()
	email: string

	@ApiProperty({ minLength: 6 })
	@MinLength(6, {
		message: 'Не менее 6 символов!'
	})
	@IsString()
	password: string
}
