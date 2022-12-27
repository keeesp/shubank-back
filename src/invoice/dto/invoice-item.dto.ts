import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class InvoiceItemDto {
	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty()
	@IsNumber()
	duration: number

	@ApiProperty()
	@IsNumber()
	rate: number

	@ApiProperty()
	@IsNumber()
	amount: number
}
