/** *******************************************************************************
 * Holds all our global state
 * ***************************************************************************** */

export const useSortByState = () => useState('sortByState', () => 'date')
export const useSortDirState = () => useState('sortDirState', () => 'desc')

/** Current page used for saving state of active pagination page */
export const useCurrentPage = () => useState<number>('currentPage', () => 0)

/** Toast state for the toast */
export const useToastState = () =>
	useState<Toast>('openToast', () => {
		return { isOpen: false, message: '', autoClose: true, color: 'red' }
	})
