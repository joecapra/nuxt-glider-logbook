/** *******************************************************************************
 * Converts Firebase Auth error messages to a more readable format
 * ***************************************************************************** */

export default function useReadableError(errorStr: string): string {
	let errorMessage: string = 'An unknown error occured'
	switch (errorStr) {
		case 'auth/wrong-password':
		case 'Firebase: Error (auth/wrong-password).':
			errorMessage = 'Password is incorrect.'
			break
		case 'auth/invalid-password':
			errorMessage = 'Password must be at least 6 characters.'
			break
		case 'auth/email-already-in-use':
			errorMessage = 'A user with that email already exists.'
			break
		case 'auth/user-not-found':
		case 'Firebase: Error (auth/user-mismatch).':
			errorMessage = 'No account with that email found.'
			break
	}
	return errorMessage
}
