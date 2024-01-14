export const convertToNumber = (input: string): number | undefined => {
	const number = +input
	return isNaN(number) ? undefined : number
}
