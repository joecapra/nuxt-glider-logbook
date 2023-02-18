<template>
	<Form @submit="submitRegisterForm" :validation-schema="registerSchema" class="mt-8 space-y-6">
		<input type="hidden" name="remember" value="true" />
		<div v-if="authError" class="w-full text-red-600 flex justify-center">{{ authError }}</div>
		<div class="-space-y-px rounded-md shadow-sm">
			<div class="w-full flex flex-col justify-center mb-4">
				<ErrorMessage name="firstname" class="auth__validation-error-msg" />
				<ErrorMessage name="lastname" class="auth__validation-error-msg" />
				<ErrorMessage name="email" class="auth__validation-error-msg" />
				<ErrorMessage name="password" class="auth__validation-error-msg" />
			</div>
			<div>
				<label for="first-name" class="sr-only">First Name</label>
				<Field
					:validateOnChange="false"
					:validateOnBlur="false"
					name="firstname"
					type="text"
					class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="First Name"
				/>
			</div>
			<div>
				<label for="last-name" class="sr-only">Last Name</label>
				<Field
					:validateOnChange="false"
					:validateOnBlur="false"
					name="lastname"
					type="text"
					class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="Last Name"
				/>
			</div>
			<div>
				<label for="email-address" class="sr-only">Email address</label>
				<Field
					:validateOnChange="false"
					:validateOnBlur="false"
					name="email"
					type="email"
					class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="Email address"
				/>
			</div>
			<div>
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
		</div>
		<div class="flex gap-x-5">
			<BaseButton type="submit" class="w-full">Register</BaseButton>
		</div>
	</Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

/**
 * Vars
 */
const router = useRouter()
const authError = ref<string | null>(null)
const firestoreUser = useFirestoreUser()

/**
 * Registration Schema
 */
const registerSchema = yup.object({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	email: yup.string().required().email(),
	password: yup.string().required().min(6)
})

/**
 * Methods
 */
const submitRegisterForm = async (values: any): Promise<void> => {
	const { email, password, firstname, lastname } = values
	try {
		await firestoreUser.registerUser(email, password, firstname, lastname)
		router.replace('/dashboard')
	} catch (error) {
		if (error instanceof Error) {
			authError.value = error.message
		}
	}
}
</script>

<style scoped>
.btn__primary {
	@apply whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
