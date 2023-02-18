<template>
	<div class="w-full flex gap-2 text-slate-500">
		<div class="w-full flex items-center border border-slate-200 shadow-sm p-2">
			<div class="w-full flex">
				<div class="w-full">
					{{ props.airport.icaocode }}
				</div>
			</div>
			<div class="hidden w-full sm:flex">
				<div class="w-full">
					{{ props.airport.latlng ? props.airport.latlng : 'Not found' }}
				</div>
			</div>
			<div class="flex gap-2">
				<BaseButton
					@click="handleSetDefaultAirport"
					:class="{ 'bg-green-500 hover:bg-green-600 focus:ring-green-500': props.airport.isdefault }"
				>
					<font-awesome-icon icon="fa-solid fa-check" />
				</BaseButton>
				<BaseButton @click="handleDeleteAirport">
					<font-awesome-icon icon="fa-solid fa-trash-can" />
				</BaseButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Props
 */
const props = defineProps<{
	airport: Airport
}>()

/**
 * Emits
 */
const emit = defineEmits(['handleDeleteAirport', 'handleSetDefaultAirport'])

/**
 * Handlers
 */
const handleDeleteAirport = (): void => {
	emit('handleDeleteAirport', props.airport.id)
}

const handleSetDefaultAirport = (): void => {
	emit('handleSetDefaultAirport', props.airport.id)
}
</script>

<style scoped></style>
