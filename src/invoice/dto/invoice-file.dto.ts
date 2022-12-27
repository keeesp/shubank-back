import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class InvoiceFileDto {
	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty()
	@IsString()
	size: string

	@ApiProperty()
	@IsString()
	url: string
}
