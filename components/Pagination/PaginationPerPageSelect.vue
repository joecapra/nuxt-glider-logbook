<template>
	<div class="flex justify-center gap-4 items-center">
		<div class="block text-sm text-slate-500">Per page:</div>
		<Listbox as="div" v-model="selectedValue" class="w-[70px]">
			<div class="relative mt-1 w-full">
				<ListboxButton
					class="relative w-full cursor-default text-sm rounded-md border border-gray-300 bg-white py-1 pl-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<span class="flex items-center">
						<span class="ml-3 block truncate">{{ selectedValue.name }}</span>
					</span>
					<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
						<font-awesome-icon icon="fa-solid fa-chevron-down" />
					</span>
				</ListboxButton>

				<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
					<ListboxOptions
						class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					>
						<ListboxOption as="template" v-for="option in options" :key="option.name" :value="option" v-slot="{ active, selected }">
							<li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 ']">
								<div class="flex items-center">
									<span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ option.name }}</span>
								</div>
							</li>
						</ListboxOption>
					</ListboxOptions>
				</transition>
			</div>
		</Listbox>
	</div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
/**
 * Emits
 */
const emit = defineEmits(['onChange'])

/**
 * Vars
 */
const options = [
	{
		name: '5',
		value: 5
	},
	{
		name: '10',
		value: 10
	},
	{
		name: '20',
		value: 20
	},
	{
		name: '50',
		value: 50
	},
	{
		name: 'All',
		value: 9999
	}
]

const selectedValue = useState('flightsPerPage', () => options[0])

/**
 * Watchers
 */
watch(selectedValue, () => {
	emit('onChange', selectedValue.value.value)
})
</script>

<style scoped></style>
