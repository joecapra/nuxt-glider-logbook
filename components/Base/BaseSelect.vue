<template>
	<div class="flex justify-center gap-4 items-center h-full">
		<div v-if="props.label" class="block text-sm text-slate-500">{{ props.label }}:</div>
		<Listbox as="div" v-model="selectedValue" class="min-w-min h-full">
			<div class="relative h-full">
				<ListboxButton
					class="h-full relative flex items-center min-w-min cursor-default text-sm rounded-md border border-gray-300 bg-white py-1 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<span class="flex items-center">
						<span class="ml-3 block">{{ selectedValue?.name }}</span>
					</span>
					<span class="pointer-events-none inset-y-0 right-0 ml-3 flex items-center pr-2">
						<font-awesome-icon icon="fa-solid fa-chevron-down" />
					</span>
				</ListboxButton>

				<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
					<ListboxOptions
						class="absolute z-10 mt-1 max-h-56 min-w-content overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					>
						<ListboxOption class="min-w-content" as="template" key="default" :value="defaultOption" v-slot="{ active, selected }">
							<li :class="[active ? 'text-white bg-slate-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pr-4']">
								<div class="flex items-center min-w-content">
									<span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">Choose</span>
								</div>
							</li>
						</ListboxOption>

						<ListboxOption
							class="min-w-content"
							as="template"
							v-for="option in props.options"
							:key="option.name"
							:value="option"
							v-slot="{ active, selected }"
						>
							<li :class="[active ? 'text-white bg-slate-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pr-4']">
								<div class="flex items-center min-w-content">
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
 * Vars
 */
const props = defineProps<{
	label?: string
	options: SelectOptions[]
	selected?: number
}>()

const defaultOption = { name: 'Choose', val: '' }

const selectedValue = ref(props.selected ? props.options[props.selected] : defaultOption)

watchEffect(() => {
	/** We need to make sure we have something in the options array and a selected prop */
	/** If they don't exist then this component errors */
	if (props.options.length && props.selected) {
		selectedValue.value = props.options[props.selected]
	} else if (props.options.length && !props.selected) {
		selectedValue.value = defaultOption
	} else {
		selectedValue.value = defaultOption
	}
})
/**
 * Emits
 */
const emit = defineEmits(['onChange'])

/**
 * Watchers
 */
watch(selectedValue, () => {
	emit('onChange', selectedValue.value)
})
</script>
