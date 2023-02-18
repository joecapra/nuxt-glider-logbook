/** *******************************************************************************
 * Used to trigger opening the toast, and update toast vars
 * which are stored in global state
 * ***************************************************************************** */

export default function useToast(message: string = '', autoClose: boolean = true, color: ToastColors = 'red'): void {
	const toast = useToastState()
	toast.value = {
		isOpen: !!message,
		message: message || '',
		autoClose: autoClose,
		color: color
	}
	if (autoClose) {
		setTimeout(() => {
			toast.value = {
				isOpen: false,
				message: '',
				autoClose: true,
				color: color
			}
		}, 5000)
	}
}
