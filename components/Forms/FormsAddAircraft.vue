<template>
	<div class="basecard--full">
		<Form @submit="submitForm" :validation-schema="addAircraftSchema" class="w-full flex flex-col gap-2 sm:flex-row">
			<input type="hidden" name="remember" value="true" />
			<div class="w-full flex items-center gap-2">
				<BaseInput name="aircrafttype" type="text" label="Aircraft Type" />
			</div>
			<div class="w-full flex items-center gap-2">
				<BaseInput name="tailnumber" type="text" label="Tail Number" />
			</div>
			<div class="mt-auto">
				<BaseButton type="submit">Add Aircraft</BaseButton>
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
const addAircraftSchema = yupSchema.addAircraftSchema

/**
 * Emits
 */
const emit = defineEmits(['onSubmit'])

/**
 * Methods
 */
const submitForm = (values: any, { resetForm }: FormActions): void => {
	const { aircrafttype, tailnumber } = values
	const aircraft = {
		type: aircrafttype,
		tailnumber
	}
	resetForm()
	emit('onSubmit', aircraft)
}
</script>

<style scoped>
.inputfield {
	@apply w-full border px-4 py-2 rounded text-slate-600;
}
</style>
