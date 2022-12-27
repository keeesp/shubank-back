import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, ValidateNested } from 'class-validator'
import { InvoiceFileDto } from './invoice-file.dto'
import { InvoiceItemDto } from './invoice-item.dto'

export class InvoiceDto {
	@ApiProperty()
	@IsNumber()
	amount: number

	@ApiProperty({ type: [InvoiceItemDto] })
	@IsArray()
	@ValidateNested()
	@Type(() => InvoiceItemDto)
	items: InvoiceItemDto[]

	@ApiProperty({ type: [InvoiceFileDto] })
	@IsArray()
	@ValidateNested()
	@Type(() => InvoiceFileDto)
	files: InvoiceFileDto[]

	@ApiProperty()
	@IsNumber()
	recipient: number
}
