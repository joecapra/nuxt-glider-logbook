<template>
	<head>
		<title>LOGBOOK - Flight {{ flightId }}</title>
	</head>
	<div class="container mx-auto w-11/12 bg-slate-600 text-slate-100 text-2xl rounded shadow-lg md:max-w-screen-lg pl-8 py-3 mb-4">
		{{ `${user?.firstname} ${user?.lastname}'s Flight` }}
	</div>
	<div class="basecard">
		<div class="mb-4 w-full flex justify-between">
			<div class="text-xl text-slate-500">Flight Details</div>
			<BaseButton v-if="flight?.igcfile" @click="downloadIgcFile">
				<font-awesome-icon icon="fa-solid fa-file-arrow-down" /><span class="hidden md:inline md:pl-2">Download IGC</span>
			</BaseButton>
		</div>
		<div v-if="flightIsLoaded" class="w-full">
			<div class="w-full flex flex-col border bg-slate-100 border-slate-200 rounded-xl shadow-lg p-2">
				<div class="flex">
					<div class="data__col">
						<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-calendar-days" />{{ flight?.date }}</div>
						<div class="data__row items-center">
							<font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-up" />{{ flight?.aircraft
							}}<span class="text-[.6rem] pl-1">({{ flight?.tailnumber }})</span>
						</div>
					</div>
					<div class="data__col">
						<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-departure" />{{ flight?.departure }}</div>
						<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-arrival" />{{ flight?.arrival }}</div>
					</div>
					<div class="data__col">
						<div class="data__row">
							<font-awesome-icon class="fa__icon" icon="fa-solid fa-arrow-up-wide-short" />{{ flight?.releasealt }}'
						</div>
						<div class="data__row">
							<font-awesome-icon class="fa__icon" icon="fa-solid fa-arrow-down-short-wide" />{{ flight?.maxalt }}'
						</div>
					</div>
					<div class="data__col">
						<div class="data__row">
							<font-awesome-icon class="fa__icon" icon="fa-solid fa-clock" />{{ utils.convertMinutesToTime(flight?.flighttime) }}
						</div>
					</div>
				</div>
				<div v-if="flight?.comments" class="data__col mt-4 pl-2">
					Comments:<br />
					{{ flight?.comments }}
				</div>
			</div>
			<div v-if="flightIsLoaded && !flight?.igcfile" class="w-full mt-6">
				<div class="text-slate-600">Departure Airport: {{ flight?.departure }}</div>
				<BaseAirportMap class="w-full h-full" :latlng="flight?.departurelatlng" zoom="13" preloaderSize="small" />
			</div>
			<div v-if="!iframeLoaded" class="w-full py-6 text-lg text-slate-500 text-center">
				<BasePreloaderDots class="ml-1" size="12px" gap="18px" color="rgb(226 232 240)" highlightColor="rgb(99 102 241)" />Loading flight
				visualizer
			</div>
			<iframe
				v-if="flightIsLoaded && flight?.igcfile"
				:src="mapDisplayUrl + '/igcdisplay/index.html?igcUrl=' + encodeURIComponent(flight?.igcfile)"
				width="100%"
				height="850px"
				frameborder="0"
				@load="iframeIsLoaded"
			>
			</iframe>
		</div>
		<div v-else class="relative w-full h-24">
			<BasePreloader class="bg-transparent" circleColor="#e2e8f0" />
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Composables
 */
const utils = useUtils()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const firestoreUser = useFirestoreUser()
const firestoreFlights = useFirestoreFlights()
const flightIsLoaded = ref(false)

/**
 * Vars
 */
const userId = route.params.userId as string
const flightId = route.params.flightId as string
const mapBaseUrl = runtimeConfig.public.baseUrl
const mapDisplayUrl = ref(mapBaseUrl)
console.log(`page:flight/[userid]/[id] - userId: ${userId} flightId: ${flightId}`)

const flight = ref<Flight>()
const user = ref<User>()

/**
 * <Methods>
 */
const downloadIgcFile = async () => {
	await navigateTo(flight.value?.igcfile, {
		external: true
	})
}

const getFlight = async (): Promise<void> => {
	user.value = (await firestoreUser.getUser(userId)) as User
	flight.value = (await firestoreFlights.getFlight(userId, flightId)) as Flight
	flightIsLoaded.value = true
}

getFlight()

const iframeLoaded = ref(false)
function iframeIsLoaded() {
	iframeLoaded.value = true
}
</script>

<style scoped>
.data__col {
	@apply flex flex-col justify-start h-full w-full text-slate-500;
}
.data__row {
	@apply flex flex items-center justify-start;
}
.fa__icon {
	@apply p-2 text-slate-500;
	height: 18px;
}
</style>
