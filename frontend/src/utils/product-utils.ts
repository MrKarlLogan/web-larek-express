
<<<<<<< HEAD
export function addSpacesToNumber(num: number) {
=======
export function addSpacesToNumber(num:number) {
>>>>>>> review
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
