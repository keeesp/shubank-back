import { ApiProperty } from '@nestjs/swagger'
import { EnumTransactionStatus, EnumTransactionType } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'

export class TransactionDto {
	@ApiProperty({ required: false })
	@IsNumber()
	@IsOptional()
	invoice?: number

	@ApiProperty({
		enum: EnumTransactionStatus,
		required: false,
		default: EnumTransactionStatus.Complete
	})
	@IsOptional()
	@IsEnum(EnumTransactionStatus)
	status?: EnumTransactionStatus = EnumTransactionStatus.Complete

	@ApiProperty({
		enum: EnumTransactionType,
		required: false,
		default: EnumTransactionType.TOP_UP
	})
	@IsEnum(EnumTransactionType)
	@IsOptional()
	type?: EnumTransactionType
}
