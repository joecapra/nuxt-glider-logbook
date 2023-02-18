/** *******************************************************************************
 * Handles all the actions for users
 * ***************************************************************************** */
import { collection, getDocs, deleteDoc, updateDoc, setDoc, getDoc, query, onSnapshot, where, doc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
const { db } = useFirestore()
const firebaseAuth = useFirebaseAuth()
const firebaseStorage = useFirebaseStorage()

const useFirestoreUser = () => {
	const loginUser = async (email: string, password: string): Promise<string> => {
		const credentials = await firebaseAuth.loginUser(email, password)
		await setLoggedInUser(credentials.uid)
		console.log('useFirestoreUser:loginUser - User logged in!  userId=', credentials.uid)
		return credentials.uid
	}

	const registerUser = async (email: string, password: string, firstname: string, lastname: string): Promise<string> => {
		const firestoreStore = useFirestoreStore()
		const { user, flightsLoaded } = storeToRefs(firestoreStore)
		const credentials = await firebaseAuth.registerUser(email, password)

		/** Add user to firestore */
		const newUser: User = {
			userId: credentials.uid,
			firstname,
			lastname,
			aircraft: '',
			homeairport: '',
			profilepic: '/images/defaultProfilePic.jpg'
		}

		await setDoc(doc(db, 'users', credentials.uid), newUser)
		/** Set the newly registered user as logged in and set their user data in the store */
		user.value = newUser
		/** This new user will have no flights yet, so set flights loaded to true so preloader does not show */
		flightsLoaded.value = true
		await setLoggedInUser(credentials.uid)
		console.log('useFirestoreUser:registerUser - User registered! userId=', credentials.uid)
		return credentials.uid
	}

	/** Store logged in users info in the store.  */
	const setLoggedInUser = async (userId: string): Promise<void> => {
		console.log(`useFirestoreUser:setLoggedInUser - userId:${userId}`)
		const firestoreFlights = useFirestoreFlights()
		const firestoreSettings = useFirestoreSettings()
		const firestoreStore = useFirestoreStore()
		const { user } = storeToRefs(firestoreStore)

		/** If we have alrady have a logged in user set, we don't need to do it again */
		try {
			/** Get user profile data from RTDB */
			const data = await getUser(userId)
			const { firstname, lastname, aircraft, homeairport, profilepic } = data as User
			/** Set the users data into this store */
			user.value.userId = userId
			user.value.firstname = firstname
			user.value.lastname = lastname
			user.value.aircraft = aircraft
			user.value.homeairport = homeairport
			user.value.profilepic = profilepic
			console.log(`useFirestoreUser - Got logged in User data from Users in Firebase! Data: ${data}`)
			firestoreFlights.getFlights(userId)
			firestoreSettings.getAircraft(userId)
			firestoreSettings.getAirports(userId)
		} catch (error) {
			useToast(`Error setting user as logged in to the store`)
		}
	}

	const getUser = async (userId: string) => {
		console.log(`useFirestoreUser:getUser(${userId})`)
		const docRef = doc(db, 'users', userId)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			console.log('useFirestoreUser:getUser - Got user data:', docSnap.data())
			return docSnap.data() as User
		} else {
			useToast(`Error getting user. No such user or user data exists`)
		}
	}

	const editUserProfile = async (updatedProfile: User): Promise<void> => {
		const firestoreStore = useFirestoreStore()
		const { user } = storeToRefs(firestoreStore)
		console.log(`useFirestoreUser:editUserProfile(${user.value.userId})`)
		try {
			const userRef = doc(db, 'users', user.value.userId)
			await updateDoc(userRef, { ...updatedProfile })
			user.value = updatedProfile
		} catch (error) {
			if (error instanceof Error) {
				useToast(`Error editing profile for userId: ${user.value.userId}`)
			}
		}
	}

	const reAuth = async (email: string, password: string): Promise<boolean> => {
		console.log('useFirebaseUser:reAuth()')
		try {
			const res = await firebaseAuth.reAuth(email, password)
			return res
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message)
			}
			return false
		}
	}

	const deleteUserAccount = async (): Promise<void> => {
		const firestoreStore = useFirestoreStore()
		const { user, flights } = storeToRefs(firestoreStore)
		console.log(`useFirestoreUser:getUser(${user.value.userId})`)

		try {
			/** ************************************************************************
			 * DELETE ALL FLIGHTS AND PROFILE PIC FOR THIS USERID FROM FIREBASE STORAGE
			 ************************************************************************* */

			/** Map userFlights to pull out all the flightIds. */
			const flightIds = flights.value.map((flight) => flight.flightId)
			/** Iterate flightIds array and delete all files for that flightId */
			if (flightIds.length > 0) {
				flightIds.forEach((flightId) => {
					firebaseStorage.deleteFile(`${user.value.userId}/${flightId}`)
				})
			}
			/** Now delete any profile pic */
			await firebaseStorage.deleteFile(`${user.value.userId}/profilepic`)
			console.log(`useFirestoreUser:deleteUserAccount - User files deleted from storage`)

			/** ************************************************************************
			 * DELETE USER FLIGHTS COLLECTION FROM FIRESTORE DB
			 ************************************************************************* */

			/** We need to delete all the flights in this users flights collection one by */

			/** Get a snapshot of all the items on the flights collection */
			const flightsQ = query(collection(db, 'users', user.value.userId, 'flights'))
			const flightsQuerySnapshot = await getDocs(flightsQ)

			/**
			 * We want to wait for all flights to be deleted before
			 * we try to delete the parent user document.
			 */
			await Promise.all(
				flightsQuerySnapshot.docs.map(async (doc) => {
					await deleteDoc(doc.ref)
				})
			)
			console.log('useFirestoreUser:deleteUserAccount - FLIGHTS COLLECTION DELETED')

			/** ************************************************************************
			 * DELETE USER AIRPORTS COLLECTION FROM FIRESTORE DB
			 ************************************************************************* */

			/** We need to delete all the airport in this users airports collection one by */

			/** Get a snapshot of all the items on the airports collection */
			const airportsQ = query(collection(db, 'users', user.value.userId, 'airports'))
			const airportsQuerySnapshot = await getDocs(airportsQ)

			/**
			 * We want to wait for all airports to be deleted before
			 * we try to delete the parent user document.
			 */
			await Promise.all(
				airportsQuerySnapshot.docs.map(async (doc) => {
					await deleteDoc(doc.ref)
				})
			)
			console.log('useFirestoreUser:deleteUserAccount - AIRPORTS COLLECTION DELETED')

			/** ************************************************************************
			 * DELETE USER AIRCRAFT COLLECTION FROM FIRESTORE DB
			 ************************************************************************* */

			/** We need to delete all the airport in this users airports collection one by */

			/** Get a snapshot of all the items on the airports collection */
			const aircraftQ = query(collection(db, 'users', user.value.userId, 'aircraft'))
			const aircraftQuerySnapshot = await getDocs(aircraftQ)

			/**
			 * We want to wait for all aircraft to be deleted before
			 * we try to delete the parent user document.
			 */
			await Promise.all(
				aircraftQuerySnapshot.docs.map(async (doc) => {
					await deleteDoc(doc.ref)
				})
			)
			console.log('useFirestoreUser:deleteUserAccount - AIRCRAFT COLLECTION DELETED')

			/** ************************************************************************
			 * DELETE USER DOC FROM FIRESTORE DB
			 ************************************************************************* */
			const userRef = doc(db, 'users', user.value.userId)
			await deleteDoc(userRef)
			console.log(`useFirestoreUser:deleteUserAccount - User deleted from DB: ${user.value.userId}`)

			/** CLEAR USER STORE */
			firestoreStore.clearStore()

			/** DELETE USER FROM FIREBASE AUTH */
			firebaseAuth.deleteUserAccount()
			firebaseAuth.logoutUser()

			const router = useRouter()
			router.replace('/auth')
		} catch (error) {
			if (error instanceof Error) {
				console.log(error)
				useToast(`Error deleting user account2. ${error.message}`)
			} else {
				console.error('useFirestoreUser:deleteUserAccount - ERROR DELETING USER! Error:', error)
			}
		}
	}

	return {
		loginUser,
		registerUser,
		setLoggedInUser,
		editUserProfile,
		getUser,
		deleteUserAccount,
		reAuth
	}
}

export default useFirestoreUser
