<template>
	<Form @submit="submitReAuth" :validation-schema="loginSchema" class="w-full">
		<div v-if="authError" class="w-full text-red-600 flex justify-center">{{ authError }}</div>
		<div class="w-full flex flex-col items-center rounded-md shadow-sm">
			<div class="w-full flex flex-col items-center gap-2">
				<ErrorMessage name="email" class="auth__validation-error-msg" />
				<ErrorMessage name="password" class="auth__validation-error-msg" />
			</div>
			<div class="w-full">
				<label for="email-address" class="sr-only">Email address</label>
				<Field
					:validateOnChange="false"
					:validateOnBlur="false"
					name="email"
					type="email"
					class="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="Email address"
				/>
			</div>
			<div class="w-full">
				<label for="password" class="sr-only">Password</label>
				<Field
					:validateOnChange="false"
					:validateOnBlur="false"
					name="password"
					type="password"
					class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="Password"
				/>
			</div>
			<BaseButton type="submit" class="bg-red-600 hover:bg-red-700 mt-4">DELETE MY ACCOUNT</BaseButton>
		</div>
	</Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

/**
 * Emits
 */
const emit = defineEmits(['onReauthSuccess'])
/**
 * Vars
 */
const router = useRouter()
const authError = ref<string | null>(null)
const firestoreUser = useFirestoreUser()

/**
 * Login Schema
 */
const loginSchema = yup.object({
	email: yup.string().required().email(),
	password: yup.string().required().min(6)
})

/**
 * Methods
 */
const submitReAuth = async (values: any): Promise<void> => {
	console.log('FormsReAuth:submitReAuth()')
	const { email, password } = values
	try {
		const res = await firestoreUser.reAuth(email, password)
		if (res) {
			emit('onReauthSuccess')
		}
	} catch (error) {
		if (error instanceof Error) {
			authError.value = error.message
		} else {
			console.error('FormsReAuth: An error occured during re-authorization')
		}
	}
}
</script>

<style scoped>
.btn__primary {
	@apply whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
