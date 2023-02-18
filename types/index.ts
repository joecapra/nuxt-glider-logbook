export {}

declare global {
	interface Flight {
		[index: string]: string | boolean
		flightId: string
		date: string
		aircraft: string
		tailnumber: string
		departure: string
		departurelatlng: string
		arrival: string
		flighttime: string
		igcfile: string
		ispublic: boolean
		releasealt: string
		maxalt: string
		comments: string
	}

	interface SelectOptions {
		name: string | number
		val: string | number
		data?: string
	}

	interface ActiveSort {
		sortBy: string
		sortDir: string
	}

	interface Airport {
		id: string
		icaocode: string
		latlng: string
		isdefault: boolean
	}

	interface Aircraft {
		id: string
		type: string
		tailnumber: string
		isdefault: boolean
	}

	interface User {
		userId: string
		firstname: string
		lastname: string
		aircraft: string
		homeairport: string
		profilepic: string
	}

	interface Toast {
		isOpen: boolean
		message: string
		autoClose: boolean
		color: 'red' | 'green'
	}

	interface SortOption {
		name: string
		key: string
		icon: string
	}

	type ToastColors = 'red' | 'green'

	interface StatCounts {
		[key: string]: number
	}

	interface FormActions {
		resetForm: (state?: Partial<FormState>) => void
	}

	interface FormState {
		// any error messages
		errors: Record<string, string>
		// dirty meta flags
		dirty: Record<string, boolean>
		// touched meta flags
		touched: Record<string, boolean>
		// Form Values
		values: Record<string, any>
	}
}
