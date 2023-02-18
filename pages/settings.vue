<template>
	<head>
		<title>LB - {{ fullName }}'s Settings</title>
	</head>
	<div class="container mx-auto w-11/12 bg-slate-600 text-slate-100 text-2xl rounded shadow-lg md:max-w-screen-lg pl-8 py-3 mb-4">
		<font-awesome-icon icon="fa-solid fa-gear" class="pr-2" />SETTINGS
	</div>
	<BaseCard class="gap-6">
		<div class="w-full text-left">
			<nuxt-link to="/dashboard">
				<BaseButton>
					<font-awesome-icon icon="fa-solid fa-angles-left" /><span class="hidden sm:inline sm:pl-2">Back to dashboard</span>
				</BaseButton>
			</nuxt-link>
		</div>
		<div class="w-full">
			<div class="w-full bg-slate-200 p-2 mb-2 text-lg">Aircraft:</div>
			<TransitionGroup name="item">
				<SettingsAircraftRow
					v-for="item in aircrafts"
					:key="item.tailnumber"
					:aircraft="item"
					@handleDeleteAircraft="handleDeleteAircraft"
					@handleSetDefaultAircraft="handleSetDefaultAircraft"
				/>
			</TransitionGroup>
			<FormsAddAircraft @onSubmit="handleAddAircraft" class="mt-6" />
		</div>

		<div class="w-full">
			<div class="w-full bg-slate-200 p-2 mb-2 text-lg">Airports:</div>
			<TransitionGroup name="item">
				<SettingsAirportRow
					v-for="item in airports"
					:key="item.icaocode"
					:airport="item"
					@handleDeleteAirport="handleDeleteAirport"
					@handleSetDefaultAirport="handleSetDefaultAirport"
				/>
			</TransitionGroup>
			<FormsAddAirport @onSubmit="handleAddAirport" class="mt-6" />
		</div>
	</BaseCard>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

/**
 * Set page meta/middleware
 */
definePageMeta({
	middleware: 'auth'
})

/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { user, aircrafts, airports } = storeToRefs(firestoreStore)
const firestoreSettings = useFirestoreSettings()
/**
 * Vars
 */
const fullName = computed(() => `${user.value.firstname} ${user.value.lastname}`)

/**
 * Handlers
 */
const handleAddAircraft = async (aircraft: Aircraft): Promise<void> => {
	console.log('page:settings:handleAddAircraft')
	await firestoreSettings.addAircraft(aircraft)
}

const handleDeleteAircraft = async (aircraftId: string): Promise<void> => {
	console.log('page:settings:handleDeleteAircraft')
	await firestoreSettings.deleteAircraft(aircraftId)
}

const handleSetDefaultAircraft = async (aircraftId: string): Promise<void> => {
	console.log('page:settings:handleSetDefaultAircraft')
	await firestoreSettings.setDefaultAircraft(aircraftId)
}

const handleAddAirport = async (airport: Airport): Promise<void> => {
	console.log('page:settings:handleAddAirport')
	await firestoreSettings.addAirport(airport)
}

const handleDeleteAirport = async (airportId: string): Promise<void> => {
	console.log('page:settings:handleDeleteAirport')
	await firestoreSettings.deleteAirport(airportId)
}

const handleSetDefaultAirport = async (airportId: string): Promise<void> => {
	console.log('page:settings:handleSetDefaultAirport')
	await firestoreSettings.setDefaultAirport(airportId)
}
</script>

<style scoped>
.item-enter-active,
.item-move,
.item-leave-active {
	transition: all 0.3s ease;
}
.item-enter-from,
.item-leave-to {
	opacity: 0;
	scale: 0.95;
}
.item-leave-active {
	position: absolute;
}
</style>
