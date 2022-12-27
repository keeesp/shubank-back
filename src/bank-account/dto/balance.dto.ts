import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class BalanceDto {
	@ApiProperty()
	@IsNumber()
	amount: number

	@ApiProperty({ minLength: 9, maxLength: 9 })
	@IsString()
	@MinLength(9)
	@MaxLength(9)
	accountNumber: string
}
