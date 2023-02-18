<template>
	<div class="basecard--fit min-w-3/4 m-6">
		<div class="flex min-w-full min-h-full items-center justify-center">
			<div class="w-full max-w-md space-y-4">
				<div class="mb-6">
					<img class="mx-auto h-20 w-auto" src="/images/glider-login.svg" alt="Your Company" />
					<h2 class="mt-6 text-center text-3xl tracking-tight text-slate-600">{{ authMessage }}</h2>
				</div>
				<FormsLogin v-if="authMode === authModes.login" />
				<FormsRegistration v-if="authMode === authModes.register" />
				<div @click.prevent="toggleAuthMode" class="btn__secondary">... or {{ btnSecondaryLabel }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Vars
 */
const authError = ref<string | null>(null)

const btnLabels = {
	login: 'Login',
	register: 'Register'
}

const authModes = ref({
	login: 'login',
	register: 'register'
})

const authMode = ref(authModes.value.login)

const btnPrimaryLabel = ref(btnLabels.login)
const btnSecondaryLabel = ref(btnLabels.register)

const authMessage = computed(() => {
	return authMode.value === authModes.value.login ? 'Login to your account' : 'Register for an account'
})

/**
 * Methods
 */
const toggleAuthMode = (): void => {
	authError.value = null
	authMode.value = authMode.value === authModes.value.login ? authModes.value.register : authModes.value.login
}

/**
 * Watchers
 */
watch(authMode, () => {
	btnPrimaryLabel.value = authMode.value === authModes.value.login ? btnLabels.login : btnLabels.register
	btnSecondaryLabel.value = authMode.value === authModes.value.login ? btnLabels.register : btnLabels.login
})
</script>

<style scoped>
.btn__secondary {
	@apply cursor-pointer whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black hover:bg-indigo-50 hover:ring-2 hover:ring-indigo-500;
}
</style>
