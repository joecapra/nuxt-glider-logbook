/** *******************************************************************************
 * Initializes Firebase Auth
 * ***************************************************************************** */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig()
	/**
	 * Firebase config
	 */
	const firebaseConfig = {
		apiKey: runtimeConfig.public.firebaseApiKey,
		authDomain: 'logbook-7cff5.firebaseapp.com',
		databaseURL: 'https://logbook-7cff5-default-rtdb.firebaseio.com',
		projectId: 'logbook-7cff5',
		storageBucket: 'logbook-7cff5.appspot.com',
		messagingSenderId: '309631439586',
		appId: '1:309631439586:web:ec76d5b0560bde562b04bb'
	}

	/**
	 * Firebase init
	 */
	const app = initializeApp(firebaseConfig)

	/** Make auth accessible by composables globally */
	const auth = getAuth()
	nuxtApp.vueApp.provide('auth', auth)
	nuxtApp.provide('auth', auth)
	console.log('plugin:firebaseAuth - Firebase Auth initialized')
})
