<template>
	<div v-if="windowWidth < 800" class="flex justify-center items-center">
		<SortBarMobile v-model="activeSort" />
	</div>
	<div v-else class="flex gap-2 justify-center items-center ml-4">
		<div class="pr-2 text-slate-600 whitespace-nowrap">Sort by:</div>
		<SortOrderButton
			v-for="(item, index) in sortButtons"
			:key="`${item.label}${index}`"
			:label="item.label"
			:field="item.field"
			v-model="activeSort"
			class="sortbar__icon border-l-2 pl-1"
		/>
	</div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

/**
 * Props
 */
const props = defineProps<{
	modelValue: ActiveSort
}>()

/**
 * Vars
 */
const { width: windowWidth } = useWindowSize()

/** Used to generate the sort buttons */
const sortButtons = [
	{ label: 'Date', field: 'date' },
	{ label: 'Aircraft', field: 'aircraft' },
	{ label: 'Departure', field: 'departure' },
	{ label: 'Arrival', field: 'arrival' },
	{ label: 'Flight Time', field: 'flighttime' },
	{ label: 'Public', field: 'ispublic' }
]

/** Set the default sort state */
const activeSort = ref<ActiveSort>(props.modelValue)

/**
 * Emits
 */
const emit = defineEmits(['update:modelValue'])

/**
 * Watchers
 */

/** When our activeSort gets changed (a sort button was clicked and modelValue was updated)
 * We need to update the parents (dashboard) modelValue so sorting takes place */
watch(activeSort, () => {
	emit('update:modelValue', activeSort.value)
})
</script>

<style scoped>
.sortbar__btn-row {
	@apply cursor-pointer border-l-2 px-2 flex gap-1 text-slate-500 whitespace-nowrap;
}
.sortbar__icon {
	@apply text-slate-500;
}
</style>
