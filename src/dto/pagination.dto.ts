import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
	@ApiProperty({ required: false, default: 1 })
	@IsOptional()
	page?: string

	@ApiProperty({ required: false, default: 30 })
	@IsOptional()
	perPage?: string
}

export class OrderByWithPagination extends PaginationDto {
	@ApiProperty({ required: false, default: 'desc' })
	@IsString()
	@IsOptional()
	orderBy?: 'desc' | 'asc'
}
