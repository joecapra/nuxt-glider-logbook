import { onAuthStateChanged, getAuth } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
	console.log('middleware:auth - Middleware ran')

	const firestoreStore = useFirestoreStore()
	const firestoreUser = useFirestoreUser()
	const auth = getAuth()

	if (!auth.currentUser) {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			const router = useRouter()
			if (user) {
				/** If we already have a user set in the store do not set them as logged in again */
				unsubscribe() // Stop listening to onAuthStateChange
				if (!firestoreStore.getCurrentUser.userId) {
					await firestoreUser.setLoggedInUser(user.uid)
				}
				console.log('middleware:auth:onAuthStateChanged - User IS logged in, do not block route')
				/** If a user is logged in and they came from the index, send them to the dashboard */
				if (from.name === 'index') {
					navigateTo('/dashboard')
				}
			} else {
				console.log('middleware:auth:onAuthStateChanged - User IS NOT logged in, redirect to auth page')
				unsubscribe() // Stop listening to onAuthStateChange
				return router.replace('/auth')
			}
		})
	} else {
		if (!firestoreStore.getCurrentUser.userId) {
			await firestoreUser.setLoggedInUser(auth.currentUser.uid)
		}
		if (from.name === 'index') {
			navigateTo('/dashboard')
		}
	}
})
