<template>
	<head>
		<title>LB - Flight {{ flightId }}</title>
	</head>
	<div class="container mx-auto w-11/12 bg-slate-600 text-slate-100 text-2xl rounded shadow-lg md:max-w-screen-lg pl-8 py-3 mb-4">
		FLIGHT DETAILS
	</div>
	<div class="basecard min-h-[800px]">
		<div class="flex w-full justify-between">
			<nuxt-link to="/dashboard">
				<BaseButton
					><font-awesome-icon icon="fa-solid fa-angles-left" /><span class="hidden sm:inline sm:pl-2">Back to Flights</span></BaseButton
				>
			</nuxt-link>
			<div class="flex gap-2">
				<BaseButton v-if="flight?.igcfile" @click="downloadIgcFile">
					<font-awesome-icon icon="fa-solid fa-file-arrow-down" /><span class="hidden md:inline md:pl-2">Download IGC</span>
				</BaseButton>
				<BaseButton @click="openCopyLinkModal = true">
					<font-awesome-icon icon="fa-solid fa-link" /><span class="hidden md:inline md:pl-2">Get Link</span>
				</BaseButton>
				<BaseButton @click="openEditForm = true">
					<font-awesome-icon icon="fa-solid fa-pen-to-square" /><span class="hidden md:inline md:pl-2">Edit Flight</span>
				</BaseButton>
				<BaseButton @click.prevent="openDeleteModal = true">
					<font-awesome-icon icon="fa-solid fa-trash-can" /><span class="hidden md:inline md:pl-2">Delete Flight</span>
				</BaseButton>
			</div>
		</div>
		<FlightEdit v-if="flight" :open="openEditForm" :flight="flight" @wasClosed="openEditForm = false" />
		<div v-if="flight" class="w-full flex-col border bg-slate-100 border-slate-200 rounded-xl shadow-lg p-2">
			<div class="w-full grid grid-cols-2 sm:grid-cols-4 bg-slate-100">
				<div class="flight__data-col">
					<div class="flight__data-row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-calendar-days" />{{ flight?.date }}</div>
					<div class="flight__data-row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-up" />{{ flight?.aircraft
						}}<span class="text-[.6rem] pl-1">({{ flight?.tailnumber }})</span>
					</div>
				</div>
				<div class="flight__data-col">
					<div class="flight__data-row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-departure" />{{ flight?.departure }}
					</div>
					<div class="flight__data-row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-arrival" />{{ flight?.arrival }}</div>
				</div>
				<div class="flight__data-col">
					<div class="flight__data-row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-arrow-up-wide-short" />{{ flight?.releasealt }}'
					</div>
					<div class="flight__data-row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-arrow-down-short-wide" />{{ flight?.maxalt }}'
					</div>
				</div>
				<div class="flight__data-col">
					<div class="flight__data-row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-clock" />{{ utils.convertMinutesToTime(flight?.flighttime) }}
					</div>
					<div v-if="flight?.ispublic" class="flight__data-row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-unlock" />Public</div>
					<div v-else class="flight__data-row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-lock" />Private</div>
				</div>
			</div>
			<div v-if="flight?.comments" class="flight__data-col mt-4 pl-2">
				Comments:<br />
				{{ flight?.comments }}
			</div>
		</div>
		<div v-else class="relative w-full h-36">
			<BasePreloader class="bg-transparent" circleColor="#e2e8f0" />
		</div>
		<div v-if="flight && !flight?.igcfile" class="w-full mt-6">
			<div class="text-slate-600">Departure Airport: {{ flight?.departure }}</div>
			<BaseAirportMap
				class="h-full w-full sm:h-[443px]"
				:latlng="flight?.departurelatlng"
				:mapHeight="400"
				zoom="13"
				preloaderSize="large"
			/>
		</div>
		<div v-if="flight && flight?.igcfile && !iframeLoaded" class="w-full py-6 text-lg text-slate-500 text-center">
			<BasePreloaderDots class="ml-1" size="12px" gap="18px" color="rgb(226 232 240)" highlightColor="rgb(99 102 241)" />
			Loading flight visualizer
		</div>
		<iframe
			v-if="flight && flight?.igcfile"
			:src="mapDisplayUrl + '/igcdisplay/index.html?igcUrl=' + encodeURIComponent(flight?.igcfile)"
			width="100%"
			height="850px"
			frameborder="0"
			@load="iframeIsLoaded"
		>
		</iframe>

		<!-- MODALS -->
		<BaseModal v-model="openDeleteModal">
			<div class="text-lg cursor-default">Are you sure you want to delete This flight?</div>
			<div class="flex flex-col justify-center items-center gap-4 pt-5 sm:flex-row">
				<BaseButton @click="handleDeleteFlight" type="button" class="bg-red-600 hover:bg-red-700 f focus:ring-red-500">
					YES, DELETE FLIGHT
				</BaseButton>
				<BaseButton @click="openDeleteModal = false" type="button"> CANCEL </BaseButton>
			</div>
		</BaseModal>
		<BaseModal v-model="openCopyLinkModal">
			<div class="text-lg cursor-default">
				The {{ flight?.ispublic ? 'public' : 'private' }} url for this flight is:<br /><span class="text-slate-500 text-xs urlfield">{{
					flightUrl
				}}</span>
			</div>
			<div class="flex gap-1 pt-5">
				<BaseButton @click="utils.copyToClipboard(flightUrl)" type="button"> COPY TO CLIPBOARD </BaseButton>
			</div>
		</BaseModal>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

/**
 * Set page meta/middleware
 */
definePageMeta({
	middleware: 'auth'
})

/**
 * Composables
 */
const firestoreStore = useFirestoreStore()
const runtimeConfig = useRuntimeConfig()
const firestoreFlights = useFirestoreFlights()
const utils = useUtils()
const route = useRoute()

/**
 * Store
 */
const { user } = storeToRefs(firestoreStore)
const { flights } = storeToRefs(firestoreStore)

/**
 * Vars
 */
const mapBaseUrl = runtimeConfig.public.baseUrl
const flightId = route.params.id as string
const mapDisplayUrl = ref(mapBaseUrl)
const openEditForm = ref(false)
const openCopyLinkModal = ref(false)
const openDeleteModal = ref(false)

const flight = computed(() => {
	return flights.value.find((flight) => flight.flightId === flightId) as Flight
})

const flightUrl = computed(() => {
	if (flight.value.ispublic) {
		return `${runtimeConfig.public.baseUrl}/flight/${user.value.userId}/${flight.value.flightId}`
	}
	return `${runtimeConfig.public.baseUrl}/flight/${flight.value.flightId}`
})

/**
 * Handlers
 */

const downloadIgcFile = async () => {
	await navigateTo(flight.value.igcfile, {
		external: true
	})
}

/** After flight has been edited, update the state with the new flight data */
const handleDeleteFlight = async (): Promise<void> => {
	try {
		await firestoreFlights.deleteFlight(flightId)
		navigateTo('/dashboard')
	} catch (error) {
		if (error instanceof Error) {
			useToast(`Error deleting flight: ${error.message}`)
		} else {
			console.log(`page:flight/[id]:handleFlightEdited - Error deleting flight: ${error}`)
		}
	}
}

const iframeLoaded = ref(false)
function iframeIsLoaded() {
	iframeLoaded.value = true
}
</script>

<style scoped>
.flight__data-col {
	@apply flex flex-col justify-start h-full w-full text-slate-500;
}
.flight__data-row {
	@apply flex items-center justify-start;
}
.fa__icon {
	@apply p-2 text-slate-500;
	height: 18px;
}
</style>
