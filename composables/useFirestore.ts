/** *******************************************************************************
 * Initializes Firestore and provides DB access
 * ***************************************************************************** */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

/**
 * Composables
 */
const runtimeConfig = useRuntimeConfig()

const useFirestore = () => {
	// Firebase configuration
	const firebaseConfig = {
		apiKey: runtimeConfig.public.firebaseApiKey,
		authDomain: 'logbook-7cff5.firebaseapp.com',
		databaseURL: 'https://logbook-7cff5-default-rtdb.firebaseio.com',
		projectId: 'logbook-7cff5',
		storageBucket: 'logbook-7cff5.appspot.com',
		messagingSenderId: '309631439586',
		appId: '1:309631439586:web:ec76d5b0560bde562b04bb'
	}

	// Initialize Firebase
	const app = initializeApp(firebaseConfig)
	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app)

	return {
		db
	}
}

export default useFirestore
