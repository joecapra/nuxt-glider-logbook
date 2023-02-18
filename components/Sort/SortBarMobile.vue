<template>
	<div class="flex justify-center gap-2 items-center w-full">
		<div class="block text-sm font-medium text-gray-700">Sort By:</div>
		<Listbox as="div" v-model="selectedSortField" class="w-44">
			<div class="relative mt-1 w-full">
				<ListboxButton
					class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
				>
					<span class="flex items-center">
						<span class="ml-3 block truncate">{{ selectedSortField?.name }}</span>
					</span>
					<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
						<font-awesome-icon icon="fa-solid fa-chevron-down" />
					</span>
				</ListboxButton>

				<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
					<ListboxOptions
						class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					>
						<ListboxOption as="template" v-for="option in sortByOptions" :key="option.name" :value="option" v-slot="{ active, selected }">
							<li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
								<div class="flex items-center">
									<font-awesome-icon :icon="option.icon" />
									<span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ option.name }}</span>
								</div>
							</li>
						</ListboxOption>
					</ListboxOptions>
				</transition>
			</div>
		</Listbox>
		<SortOrderButton :field="selectedSortField.key" v-model="activeSort" class="text-slate-500" />
	</div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

/**
 * Props
 */
const props = defineProps<{
	modelValue: ActiveSort
}>()

/**
 * Vars
 */
const activeSort = ref<ActiveSort>(props.modelValue)
const sortByOptions = [
	{
		name: 'Date',
		key: 'date',
		icon: 'fa-solid fa-calendar-days'
	},
	{
		name: 'Aircraft',
		key: 'aircraft',
		icon: 'fa-solid fa-plane-up'
	},
	{
		name: 'Departure',
		key: 'departure',
		icon: 'fa-solid fa-plane-departure'
	},
	{
		name: 'Arrival',
		key: 'arrival',
		icon: 'fa-solid fa-plane-arrival'
	},
	{
		name: 'Flight Time',
		key: 'flighttime',
		icon: 'fa-solid fa-clock'
	},
	{
		name: 'Public / Private',
		key: 'ispublic',
		icon: 'fa-solid fa-lock'
	}
]

/** Preselect the dropdown with the currently sorted field from modelValue */
const selectedSortField = ref(getSelectedKey())

/**
 * Emits
 */
const emit = defineEmits(['update:modelValue'])

/**
 * Methods
 */
/** Gets the sort option based on key (field to sort by) */
function getSelectedKey(): SortOption {
	const res = sortByOptions.find((el) => el.key === props.modelValue.sortBy)
	if (res) return res
	return sortByOptions[0]
}

/**
 * Watchers
 */
watch(selectedSortField, () => {
	/**
	 * Watch for dropdown selection to change, then update active sort to use
	 * the key from the item selected in the dropdown and the existing sort direction.
	 * SelectedSortField might be undefined because of the array.find method returning
	 * undefined if the field is not found in sortByOptions, so we have to add a default
	 */
	const newSort: ActiveSort = { sortBy: selectedSortField.value.key, sortDir: activeSort.value.sortDir }
	activeSort.value = newSort
})

watchEffect(() => {
	/** If this button is the active sort filed then set its direction */
	emit('update:modelValue', activeSort.value)
})
</script>

<style scoped></style>
