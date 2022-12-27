import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UserDto {
	@ApiProperty({ type: 'email' })
	@IsEmail()
	email: string

	@ApiProperty()
	password?: string

	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty()
	@IsString()
	address: string

	@ApiProperty()
	@IsString()
	avatarPath: string
}
