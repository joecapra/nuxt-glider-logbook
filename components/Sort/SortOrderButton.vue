<template>
	<button @click="toggle" class="flex relative justify-center items-center" :class="props.label ? 'gap-2' : 'gap-0'">
		<div class="whitespace-nowrap">{{ props.label ? `${props.label}:` : '' }}</div>
		<font-awesome-icon v-if="sortDirection === 'asc'" icon="fa-solid fa-arrow-up-wide-short" />
		<font-awesome-icon v-else icon="fa-solid fa-arrow-down-wide-short" />
	</button>
</template>

<script setup lang="ts">
/**
 * Props
 */
const props = defineProps<{
	modelValue: ActiveSort
	label?: string // Label for the button
	field: string // DB field to sort by
}>()

/**
 * Vars
 */
const sortDirection = ref('asc')

/**
 * Emits
 */
const emit = defineEmits(['update:modelValue'])

/**
 * Methods
 */
const toggle = (): void => {
	sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
	/** Update the parents v-model value */
	emit('update:modelValue', { sortBy: props.field, sortDir: sortDirection.value })
}

watchEffect(() => {
	if (props.modelValue?.sortBy !== props.field) {
		/**
		 * If the active sort field is NOT this buttons field
		 * Then swap this buttons sort direction
		 */
		sortDirection.value = props.modelValue?.sortDir === 'asc' ? 'desc' : 'asc'
	} else {
		/** If this button is the active sort filed then set its direction */
		sortDirection.value = props.modelValue?.sortDir
	}
})

const setSortDirection = (sortDir: string): void => {
	sortDirection.value = sortDir
}

/**
 * Expose setsortDirection method so we can call it from outside
 */
defineExpose({
	setSortDirection
})
</script>
