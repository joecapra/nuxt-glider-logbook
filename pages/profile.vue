<template>
	<head>
		<title>LB - {{ fullName }}'s Profile</title>
	</head>
	<div class="container mx-auto w-11/12 bg-slate-600 text-slate-100 text-2xl rounded shadow-lg md:max-w-screen-lg pl-8 py-3 mb-4">
		<font-awesome-icon icon="fa-solid fa-user" class="pr-2" />PROFILE
	</div>
	<BaseCard>
		<div class="w-full flex flex-col items-center border-slate-200">
			<nuxt-link to="/dashboard" class="w-full">
				<BaseButton><font-awesome-icon icon="fa-solid fa-angles-left" class="pr-2" /> Back to Dashboard </BaseButton>
			</nuxt-link>
			<div ref="formRef" class="w-full mb-8">
				<div class="text-slate-600 my-4">Your User ID: {{ user.userId }}</div>
				<form class="w-full flex flex-col gap-4">
					<div>
						<label class="baseinputlabel" for="firstname">First Name:</label>
						<input id="firstname" class="baseinputfield" type="text" v-model="user.firstname" />
					</div>
					<div>
						<label class="baseinputlabel" for="lastname">Last Name:</label>
						<input id="lastname" class="baseinputfield" type="text" v-model="user.lastname" />
					</div>
					<div>
						<label class="baseinputlabel">Update profile pic:</label>
						<BaseDropZone ref="dropZoneRef" @fileDropped="handleFileDropped" :fileTypes="['jpg']" />
					</div>

					<div class="flex flex-col items-center gap-4 mt-6">
						<div v-if="updateProfileInProgress" class="text-slate-500">
							<BasePreloaderDots class="ml-1" size="12px" gap="18px" color="rgb(226 232 240)" highlightColor="rgb(99 102 241)" />Updating
							profile
						</div>
						<BaseButton type="submit" @click.prevent="handleUpdateProfile" class="w-full"> Update Profile </BaseButton>
					</div>
				</form>
			</div>
		</div>
	</BaseCard>
	<BaseButton type="button" @click.prevent="openModal = true" class="bg-red-600 hover:bg-red-700 mt-8"> DELETE YOUR ACCOUNT </BaseButton>
	<BaseModal v-model="openModal">
		<div class="text-lg cursor-default">Please re-enter your credentials to continue.</div>
		<div class="w-full flex flex-col justify-center items-center gap-4 pt-5">
			<FormsReAuth @onReauthSuccess="handleDeleteAccount" />
			<div class="flex flex-col sm:flex-row gap-4">
				<!-- <BaseButton @click="handleDeleteAccount" type="button" class="bg-red-600 hover:bg-red-700"> YES, DELETE MY ACCOUNT </BaseButton> -->
				<BaseButton @click="openModal = false" type="button"> CANCEL </BaseButton>
			</div>
		</div>
	</BaseModal>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import DropZone from '~~/components/Base/BaseDropZone.vue'
/**
 * Set page meta/middleware
 */
definePageMeta({
	middleware: 'auth'
})

/**
 * Composables
 */
const firestoreUser = useFirestoreUser()
const firebaseStorage = useFirebaseStorage()

/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { user } = storeToRefs(firestoreStore)

/**
 * Vars
 */
const fileToUpload = ref<File | null>(null)
const openModal = ref(false)
const fullName = computed(() => `${user.value.firstname} ${user.value.lastname}`)
const dropZoneRef = ref<InstanceType<typeof DropZone> | null>(null)
const updateProfileInProgress = ref(false)

/**
 * Handlers
 */

const handleFileDropped = (file: File): void => {
	fileToUpload.value = file
}

const handleDeleteAccount = async (): Promise<void> => {
	try {
		firestoreUser.deleteUserAccount()
		openModal.value = false
	} catch (error) {
		if (error instanceof Error) {
			useToast(`Error deleting account:  ${error.message}`)
		}
		console.log(`page:profile:handleDeleteAccount - Error deleting account: ${error} `)
	}
}

const handleUpdateProfile = async (): Promise<void> => {
	console.log(`page:profile:updateProfile(uid: ${user.value.userId})`)
	updateProfileInProgress.value = true

	let profilePic = user.value.profilepic
	if (fileToUpload.value) {
		/**
		 * Pass userId so we can save to userID named folder on storage
		 * Pass flightId so we can save to userID/flighID folder on storage
		 */
		profilePic = await firebaseStorage.saveProfilePic(fileToUpload.value, user.value.userId)
		console.log(`page:profile:updateProfile - Added profile pic. url: ${user.value.profilepic} UID:`, user.value.userId)
	}
	const updatedProfile = {
		...user.value,
		firstname: user.value.firstname,
		lastname: user.value.lastname,
		aircraft: user.value.aircraft,
		homeairport: user.value.homeairport,
		profilepic: profilePic
	}
	/** Reset the fileToUpload and DropZone */
	fileToUpload.value = null

	/** Clear the dropzone */
	dropZoneRef.value?.clear()

	await firestoreUser.editUserProfile(updatedProfile)

	updateProfileInProgress.value = false
	window.scrollTo(0, 0)
	useToast('Your profile has been updated!', true, 'green')
	console.log(`page:profile:updateProfile - User profile has been updated to: ${updatedProfile}`)
}
</script>

<style></style>
