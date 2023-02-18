<template>
	<div class="basecard--full">
		<Form @submit="submitForm" :validation-schema="addAirportSchema" class="w-full flex flex-col gap-2 sm:flex-row">
			<input type="hidden" name="remember" value="true" />
			<div class="w-full flex items-center gap-2">
				<BaseInput name="icaocode" type="text" label="ICAO Code" placeholder="K" />
			</div>
			<div class="mt-auto">
				<BaseButton type="submit">Add Airport</BaseButton>
			</div>
		</Form>
	</div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'

/**
 * Composables
 */
const yupSchema = useYupSchema()

/**
 * Vars
 */
const addAirportSchema = yupSchema.addAirportSchema

/**
 * Emits
 */
const emit = defineEmits(['onSubmit'])

/**
 * Methods
 */
const submitForm = (values: any, { resetForm }: FormActions): void => {
	const { icaocode } = values
	const airport = {
		icaocode
	}
	resetForm()
	emit('onSubmit', airport)
}
</script>

<style scoped>
.inputfield {
	@apply w-full border px-4 py-2 rounded text-slate-600;
}
.btn__primary {
	@apply whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
