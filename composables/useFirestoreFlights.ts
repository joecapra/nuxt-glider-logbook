/** *******************************************************************************
 * Handles all the actions for flights
 * ***************************************************************************** */
import { collection, getDocs, deleteDoc, updateDoc, setDoc, getDoc, query, onSnapshot, where, doc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'

const { db } = useFirestore()
const firebaseStorage = useFirebaseStorage()
const utils = useUtils()

let flightsOnSnapshot: any = null

const useFirestoreFlights = () => {
	const clearSnapshots = (): void => {
		if (flightsOnSnapshot) flightsOnSnapshot()
	}

	const getFlights = async (userId: string): Promise<void> => {
		console.log(`useFirestoreFlights:getFlights()`)
		const firestoreStore = useFirestoreStore()
		const { flights, flightsLoaded } = storeToRefs(firestoreStore)
		const q = query(collection(db, 'users', userId, 'flights'))

		/** If we already have an onSnapshot listener running we need to stop(unsubscribe) from it */
		if (flightsOnSnapshot) flightsOnSnapshot()

		flightsOnSnapshot = onSnapshot(q, (querySnapshot) => {
			flights.value = []
			querySnapshot.forEach((doc) => {
				const data = doc.data()
				const flight = {
					flightId: doc.id,
					date: data.date,
					aircraft: data.aircraft,
					tailnumber: data.tailnumber,
					departure: data.departure,
					departurelatlng: data.departurelatlng,
					arrival: data.arrival,
					flighttime: data.flighttime,
					igcfile: data.igcfile,
					ispublic: data.ispublic,
					releasealt: data.releasealt,
					maxalt: data.maxalt,
					comments: data.comments
				}
				flights.value.push(flight)
			})
			flightsLoaded.value = true
		})
	}

	const getFlight = async (userId: string, flightId: string) => {
		console.log(`useFirestoreFlights:getFlight()`)
		const flightRef = doc(db, 'users', userId, 'flights', flightId)
		const flightSnap = await getDoc(flightRef)

		if (flightSnap.exists()) {
			console.log('useFirestoreFlights:getFlight - Document data:', flightSnap.data())
			return flightSnap.data()
		} else {
			useToast(`Error getting flight for flightId: ${flightId}`)
			console.log('useFirestoreFlights:getFlight - No such document!')
		}
	}

	const addFlight = async (flight: Flight, igcFile: File | null): Promise<void> => {
		const firestoreStore = useFirestoreStore()
		const { user } = storeToRefs(firestoreStore)
		console.log(`useFirestoreFlights:addFlight - userId: ${user.value.userId} flight: ${flight} igcFile: ${igcFile}`)

		try {
			/** Add a new document with a generated id */
			const flightRef = doc(collection(db, 'users', user.value.userId, 'flights'))
			/** Get the firestore autogenerated flightId and add it to the flight to be added */
			const flightId = flightRef.id
			flight.flightId = flightId

			if (igcFile) {
				/**
				 * Pass userId so we can save to userID named folder on storage
				 * Pass flightId so we can save to userID/flighID folder on storage
				 */
				const igcFileUrl = await firebaseStorage.saveIgcFile(igcFile, user.value.userId, flightId)
				flight.igcfile = igcFileUrl
				console.log(`useFirestoreFlights:addFlight - Added ICG File url: ${igcFileUrl}`)
			}

			/**
			 * If no departure airport lat/long was set on flight from a preselected airport
			 * then we need to hit airport database with the departure airport ICAO code
			 * to get departure airport lat/lng.
			 */
			if (!flight.departurelatlng) {
				flight.departurelatlng = await utils.getAirportLatLng(flight.departure)
			}

			/** Add the new flight to the DB */
			await setDoc(flightRef, flight)
			console.log(`useFirestoreFlights:addFlight - added flightId:`, flightRef.id)
		} catch (error) {
			if (error instanceof Error) {
				useToast(`Error adding flight: ${error.message}`)
			} else {
				console.error(`useFirestoreFlights:addFlight - Error: ${error}`)
			}
		}
	}

	const editFlight = async (flight: Flight, igcFile: File | null = null): Promise<Flight> => {
		const firestoreStore = useFirestoreStore()
		const { user } = storeToRefs(firestoreStore)
		console.log(`useFirestoreFlights:editFlight - userId: ${user.value.userId} flight: ${flight} igcFile: ${igcFile}`)

		/** Check if igc to upload and upload to firebase storage */
		if (igcFile) {
			try {
				console.log(`useFirestoreFlights:editFlightIGC - userId: ${user.value.userId} flightId: ${flight.flightId} igcFile: ${igcFile}`)
				firebaseStorage.deleteFile(`${user.value.userId}/${flight.flightId}`)
				flight.igcfile = await firebaseStorage.saveIgcFile(igcFile, user.value.userId, flight.flightId)
				console.log(`useFirestoreFlights:editFlight - New file uploaded: ${flight.igcfile}`)
			} catch (error) {
				useToast('Error deleting previous IGC file, or uploading a new IGC file')
			}
		}

		/** Update the flight */
		try {
			if (!flight.departurelatlng) {
				flight.departurelatlng = await utils.getAirportLatLng(flight.departure)
			}
			const flightRef = doc(db, 'users', user.value.userId, 'flights', flight.flightId)
			await updateDoc(flightRef, flight)
		} catch (error) {
			if (error instanceof Error) {
				useToast(`Error editing flight: ${error.message}`)
			}
		}

		console.log(`useFirestoreFlights:editFlight - Flight Edited! Updated flight:`, flight)
		return flight
	}

	const deleteFlight = async (flightId: string): Promise<void> => {
		const firestoreStore = useFirestoreStore()
		const { user } = storeToRefs(firestoreStore)
		console.log(`useFirestoreFlights:deleteFlight - Flight for userId: ${user.value.userId} flightId: ${flightId}`)

		try {
			const flightRef = doc(db, 'users', user.value.userId, 'flights', flightId)
			await deleteDoc(flightRef)
			console.log(`useFirestoreFlights:deleteFlight - Flight deleted from DB: ${flightId}`)
			await firebaseStorage.deleteFile(`${user.value.userId}/${flightId}`)
			console.log(`useFirestoreFlights:deleteFlight - File deleted for flight: ${flightId}`)
		} catch (error) {
			if (error instanceof Error) {
				useToast(`Error deleting flight: ${error.message}`)
			}
			console.log(`useFirestoreFlights:deleteFlight - Error deleting file for flightId: ${flightId} Error: `, error)
		}
	}

	return {
		clearSnapshots,
		getFlights,
		getFlight,
		addFlight,
		editFlight,
		deleteFlight
	}
}

export default useFirestoreFlights
