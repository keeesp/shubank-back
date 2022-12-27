import { getRandomNumber } from '../random-number'

const bankList = [
	'RED Bank',
	'Tinkoff bank',
	'KB Bank',
	'HSBC',
	'Bank of China'
]

export const getRandomBankName = () => {
	return bankList[getRandomNumber(0, bankList.length - 1)]
}
