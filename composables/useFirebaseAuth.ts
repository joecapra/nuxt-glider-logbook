/** *********************************************************************
 * Does the Firebase auth register, login, lougout
 * ******************************************************************** */

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	deleteUser,
	reauthenticateWithCredential,
	EmailAuthProvider
} from 'firebase/auth'

const useFirebaseAuth = () => {
	/** Register User */
	const registerUser = async (email: string, password: string) => {
		const auth = getAuth()
		const credentials = await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				return userCredential.user
				// ...
			})
			.catch((error) => {
				const readableError = useReadableError(error.code)
				throw new Error(readableError)
				// ..
			})
		console.log(`useFirebaseAuth:registerUser - User credentials: ${credentials}`)
		return credentials
	}

	/** Login User */
	const loginUser = async (email: string, password: string) => {
		const auth = getAuth()
		const credentials = await signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				return userCredential.user
				// ...
			})
			.catch((error) => {
				const readableError = useReadableError(error.code)
				throw new Error(readableError)
				// ..
			})
		console.log(`useFirebaseAuth:loginUser - User credentials: ${credentials}`)
		return credentials
	}

	/** Login User */
	const reAuth = async (email: string, password: string): Promise<boolean> => {
		console.log('useFirebaseAuth:reAuth()')
		try {
			const auth = getAuth()
			const user = auth.currentUser
			if (user) {
				const credential = EmailAuthProvider.credential(email, password)
				const res = await reauthenticateWithCredential(user, credential)
				return true
			} else {
				throw new Error('No current user to reauth')
			}
		} catch (error) {
			if (error instanceof Error) {
				const readableError = useReadableError(error.message)
				throw new Error(readableError)
			}
		}
		return false
	}

	/** Get User */
	const getUser = (): unknown => {
		const auth = getAuth()
		const user = auth.currentUser
		console.log(`useFirebaseAuth:getUser - Current User: ${user}`)
		return user
	}

	/** Delete User Account */
	const deleteUserAccount = async (): Promise<void> => {
		const auth = getAuth()
		const user: any = auth.currentUser

		console.log(`useFirebaseAuth:deleteUserAccount - User: ${user}`)
		return deleteUser(user)
			.then(() => {
				// User deleted.
				console.log(`useFirebaseAuth:deleteUserAccount - User Deleted!`)
				return
			})
			.catch((error) => {
				// An error ocurred
				useToast(`Error deleting user account1. ${error.message}`)
				console.log(`useFirebaseAuth:deleteUserAccount - Error deleting User!`, error)
				// ...
			})
	}

	/** Logout User */
	const logoutUser = async () => {
		const auth = getAuth()
		const result = await signOut(auth)
		console.log(`useFirebaseAuth:logoutUser - Logout result: ${result}`)
	}

	return {
		registerUser,
		loginUser,
		logoutUser,
		deleteUserAccount,
		getUser,
		reAuth
	}
}

export default useFirebaseAuth
