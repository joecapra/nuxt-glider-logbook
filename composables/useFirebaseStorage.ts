/** *******************************************************************************
 * Handles all uploading and deleting of files on Firebase Storage
 * ***************************************************************************** */
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'

/**
 * Composables
 */
const runtimeConfig = useRuntimeConfig()

const useFirebaseStorage = () => {
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
	const storage = getStorage(app)

	/**
	 * Save igc file
	 */
	const saveIgcFile = async (file: any, userId: string, flightId: string | null) => {
		const storageRef = ref(storage, `${userId}/${flightId}/${file.name}`)

		const res = await uploadBytes(storageRef, file).then((snapshot) => {
			console.log(`useFirebaseStorage:saveIgcFile - File uploaded!`)
			return getDownloadURL(snapshot.ref).then((url) => {
				return url
			})
		})
		return res
	}

	/**
	 * Save profile pic
	 */
	const saveProfilePic = async (file: any, userId: string): Promise<string> => {
		/** delete any existing profile pic */
		await deleteFile(`${userId}/profilepic`)
		console.log(`useFirebaseStorage:saveProfilePic - profile pic folder deleted!`)
		const storageRef = ref(storage, `${userId}/profilepic/${file.name}`)

		/** Upload the original sized image */
		const res = await uploadBytes(storageRef, file).then(async (snapshot) => {
			console.log(`useFirebaseStorage:saveProfilePic - File uploaded!`)
			/** Name of the original image */
			const originalImageName = file.name.substring(0, file.name.lastIndexOf('.'))
			/** Name the resized image will be */
			const resizedImageName = `${originalImageName}_100x100.webp`
			/** Ref to the resized image */
			const resizedImageRef = ref(storage, `${userId}/profilepic/${resizedImageName}`)

			/** Polling function to see if we have a resized image yet */
			const pollResize = async (interval: number, maxAttempts: number): Promise<string> => {
				console.log(`useFirebaseStorage:pollResize()!`)
				let attempts = 0

				const executePollResize = async (resolve: any, reject: any) => {
					console.log(`useFirebaseStorage:executePollResize()!`)
					/** Get ref to the users profilepic folder so we can iterate its items */
					const folderRef = ref(storage, `${userId}/profilepic`)
					console.log(`useFirebaseStorage:folderRef=`, folderRef)
					/** Get a list of all items in the profilepic folder */
					const listResult = await listAll(folderRef)
					console.log(`useFirebaseStorage:listResult=`, listResult)
					/** Flag to store if we found a resized image */
					let foundResizedImage = false
					/**
					 * Iterate over all items in the folder and check if the item name
					 * matches our resized image name
					 */
					listResult.items.forEach((element) => {
						console.log(`useFirebaseStorage:listResult.items ITEM =`, element.name)
						if (element.name === resizedImageName) {
							console.log(`useFirebaseStorage:FOUND MATCHING FILE`)
							/** We found a resized image! */
							foundResizedImage = true
						}
					})
					/** If we found a resized image then get its download URL and resole the promise */
					if (foundResizedImage) {
						console.log(`useFirebaseStorage:FOUND MATCHING FILE SO RESOLVE`)
						const url = await getDownloadURL(resizedImageRef)
						console.log(`useFirebaseStorage:FOUND MATCHING FILE URL: `, url)
						return resolve(url)
					} else {
						console.log(`useFirebaseStorage:CONTINUE POLLING`)
						/** No resize image was found yet so keep polling */
						attempts++
						if (maxAttempts && attempts === maxAttempts) {
							/** If we reach max attempts then just return the original sized image */
							console.log(`useFirebaseStorage:REACHED MAX ATTEMPS SO RESOLVE TO ORIG IMGE`)
							return getDownloadURL(snapshot.ref).then((url) => {
								console.log(`useFirebaseStorage:REACHED MAX ATTEMPS ORIG IMGE URL:`, url)
								return resolve(url)
							})
							// return reject(new Error('Exceeded max attempts'))
						} else {
							console.log(`useFirebaseStorage: CONTINUE POLLING SETTIMEOUT`)
							/** continue polling */
							setTimeout(executePollResize, interval, resolve, reject)
						}
					}
				}
				return new Promise(executePollResize)
			}

			/** Once original file is uploaded we start polling for the resized image */
			return getDownloadURL(snapshot.ref).then(async (url) => {
				const res = await pollResize(500, 10)
				console.log(`useFirebaseStorage: FINAL ReSULT=====================================`)
				console.log(`useFirebaseStorage: FINAL ReSULT:`, res)
				console.log(`useFirebaseStorage: FINAL ReSULT=====================================`)
				return res
			})
		})
		return res
	}

	/**
	 * Delete file(s)
	 */
	const deleteFile = async (filePath: string): Promise<void> => {
		console.log(`useFirebaseStorage:deleteFile - File path to delete: ${filePath}`)
		const storageRef = ref(storage, filePath)

		/** List all items in the folder */
		listAll(storageRef)
			.then((res) => {
				/** Iterate items and delete them (Should only be 1 file per flight) */
				res.items.forEach((itemRef) => {
					try {
						deleteObject(itemRef).then(() => {
							console.log(`useFirebaseStorage:deleteFile - File Deleted`)
						})
					} catch (error) {
						console.log(`useFirebaseStorage:deleteFile - Could not delete file: ${error}`)
					}
				})
			})
			.catch((error) => {
				useToast(`Error deleting file. ${error.message}`)
				console.log(`useFirebaseStorage:deleteFile - Could not list files for this fligh: ${error}`)
			})
	}

	return {
		saveIgcFile,
		saveProfilePic,
		deleteFile
	}
}

export default useFirebaseStorage
