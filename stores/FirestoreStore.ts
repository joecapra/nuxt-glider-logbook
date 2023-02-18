/** *******************************************************************************
 * This store holds all our user, flight, and settings data.
 * ***************************************************************************** */
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useFirestoreStore = defineStore('FirestoreStore', {
	state: () => ({
		flights: <Flight[]>[],
		aircrafts: <Aircraft[]>[],
		airports: <Airport[]>[],
		user: {
			userId: '',
			firstname: '',
			lastname: '',
			aircraft: '',
			homeairport: '',
			profilepic: ''
		} as User,
		flightsLoaded: false
	}),

	/**
	 * Getters
	 */
	getters: {
		getFlights: (state): Flight[] => state.flights,
		getCurrentUser: (state): User => state.user
	},

	/**
	 * Actions
	 */
	actions: {
		clearStore(): void {
			const firestoreFlights = useFirestoreFlights()
			const firestoreSettings = useFirestoreSettings()
			/** Stop listening to firestore */
			firestoreFlights.clearSnapshots()
			firestoreSettings.clearSnapshots()
			console.log(`store:FirestoreStore - Clear FirestoreStore!`)
			this.$reset()
		}
	}
})

/**
 * Hot reload
 */
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFirestoreStore, import.meta.hot))
}
