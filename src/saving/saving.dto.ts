import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SavingDto {
	@ApiProperty()
	@IsString()
	color: string

	@ApiProperty()
	@IsString()
	name: string
}
