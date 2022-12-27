import { ApiProperty } from '@nestjs/swagger'
import { EnumCardType, EnumPaymentSystem } from '@prisma/client'

export class UserCardsResponse {
	@ApiProperty()
	balance: number
	@ApiProperty()
	accountNumber: string
	@ApiProperty()
	id: number
	@ApiProperty()
	createdAt: Date
	@ApiProperty()
	updatedAt: Date
	@ApiProperty()
	number: string
	@ApiProperty()
	expireDate: string
	@ApiProperty()
	cvc: number
	@ApiProperty({ enum: EnumPaymentSystem })
	paymentSystem: EnumPaymentSystem
	@ApiProperty({ enum: EnumCardType })
	type: EnumCardType
	@ApiProperty()
	bankName: string
	@ApiProperty()
	bankAccountId: number
}
