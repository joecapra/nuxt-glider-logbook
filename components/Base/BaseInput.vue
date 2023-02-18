<template>
	<div class="flex flex-col w-full relative">
		<span class="text-sm text-slate-600">{{ props.label }}{{ props.label ? ':' : null }}</span>
		<ErrorMessage :name="nameRef" class="form__validation-error-msg" />
		<Field
			:name="nameRef"
			:validateOnBlur="false"
			:validateOnChange="false"
			class="w-full border px-4 py-2 rounded text-slate-600"
			:class="{ notvalid: hasErrorMsg && !fieldIsValid }"
			:type="props.type"
			:placeholder="props?.placeholder"
		/>
	</div>
</template>
<script setup lang="ts">
import { Field, ErrorMessage, useFieldError, useIsFieldValid } from 'vee-validate'

/**
 * Props
 */
const props = defineProps<{
	name: string
	type: string
	label: string
	placeholder?: string
	initvalue?: string | number
}>()

/**
 * Vars
 */
const nameRef = toRef(props, 'name')

/** True if there is an error message for this field */
const hasErrorMsg = useFieldError(nameRef)

/**
 * Validation status is checked on field input/change
 * We use this to remove the red field bg
 */
const fieldIsValid = useIsFieldValid(nameRef)
</script>

<style>
.notvalid {
	@apply bg-red-200 border-red-600;
}
</style>
