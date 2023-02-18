<template>
	<div
		class="okm w-full flex border border-slate-200 rounded-xl shadow-lg my-3 p-2 hover:scale-[1.003] hover:border-slate-300 transition duration-50"
	>
		<NuxtLink class="w-full flex flex-col items-center md:flex-row" :to="`flight/${flight.flightId}`">
			<div class="w-full h-[150px] md:mr-2 md:w-[200px] md:h-[70px]">
				<BaseAirportMap
					class="w-full h-full"
					:latlng="flight.departurelatlng"
					:mapWidth="200"
					:mapHeight="70"
					zoom="12"
					preloaderSize="small"
				/>
			</div>
			<div class="w-full grid min-[350px]:grid-cols-2 md:grid-cols-4">
				<div class="data__col">
					<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-calendar-days" />{{ flight.date }}</div>
					<div class="data__row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-up" />{{ flight.aircraft }}
						<span class="text-[.6rem] pl-1">({{ flight.tailnumber }})</span>
					</div>
				</div>
				<div class="data__col">
					<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-departure" />{{ flight.departure }}</div>
					<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-plane-arrival" />{{ flight.arrival }}</div>
				</div>
				<div class="data__col">
					<div class="data__row">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-clock" />{{ utils.convertMinutesToTime(flight.flighttime) }}
					</div>
					<div class="data__row">
						<div class="flex items-center text-sm">
							<font-awesome-icon v-if="flight.igcfile" class="fa__icon" icon="fa-solid fa-file" />
							<font-awesome-icon v-else class="fa__icon" icon="fa-solid fa-file-excel" />IGC File
						</div>
					</div>
				</div>
				<div class="data__col" v-if="flight.ispublic">
					<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-unlock" />Public</div>
					<div>
						<div class="data__row-btn" @click.prevent="openCopyLinkModal = true">
							<font-awesome-icon class="fa__icon" icon="fa-solid fa-link" />Get link
						</div>
					</div>
				</div>
				<div class="data__col" v-else>
					<div class="data__row"><font-awesome-icon class="fa__icon" icon="fa-solid fa-lock" />Private</div>
					<div class="data__row-btn" @click.prevent="openShareModal = true">
						<font-awesome-icon class="fa__icon" icon="fa-solid fa-share-nodes" />Share
					</div>
				</div>
			</div>
		</NuxtLink>
		<BaseModal v-model="openCopyLinkModal">
			<div class="text-lg cursor-default">
				The public url for this flight is:<br /><span class="text-slate-500 text-xs urlfield">{{ flightUrl }}</span>
			</div>
			<div class="flex gap-1 pt-5">
				<BaseButton @click="utils.copyToClipboard(flightUrl)" type="button"> COPY TO CLIPBOARD </BaseButton>
			</div>
		</BaseModal>
		<BaseModal v-model="openShareModal">
			<div class="text-lg cursor-default">
				{{ shareModalMessage }}<br /><span v-if="flight.ispublic" class="text-slate-500 text-xs urlfield">{{ flightUrl }}</span>
			</div>
			<div class="flex gap-1 pt-5">
				<BaseButton v-if="!flight.ispublic" @click="handleMakeFlightPublic" type="button"> MAKE PUBLIC </BaseButton>
				<BaseButton v-else @click="utils.copyToClipboard(flightUrl)" type="button"> COPY TO CLIPBOARD </BaseButton>
			</div>
		</BaseModal>
	</div>
</template>

<script lang="ts" setup>
const utils = useUtils()
const runtimeConfig = useRuntimeConfig()

/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { user } = firestoreStore

/**
 * Composables
 */
const firestoreFlights = useFirestoreFlights()

/**
 * Props
 */
const props = defineProps<{
	flight: Flight
}>()

/**
 * Vars
 */
const flightUrl = computed(() => {
	if (props.flight.ispublic) {
		return `${runtimeConfig.public.baseUrl}/flight/${user.userId}/${props.flight.flightId}`
	}
	return `${runtimeConfig.public.baseUrl}/flight/${props.flight.flightId}`
})
const openCopyLinkModal = ref(false)
const openShareModal = ref(false)
const shareModalMessage = ref('Do you want to make this flight public?')

/**
 * Handlers
 */

const handleMakeFlightPublic = async (): Promise<void> => {
	props.flight.ispublic = true
	shareModalMessage.value = 'This flight is now public. The sharable link is below.'
	const updatedFlight = { ...props.flight }
	updatedFlight.ispublic = true
	await firestoreFlights.editFlight(updatedFlight)
}
</script>

<style scoped>
.data__col {
	@apply flex flex-col justify-start h-full w-full text-slate-500;
}
.data__row {
	@apply flex items-center justify-start;
}
.fa__icon {
	@apply p-2 text-slate-500;
	height: 18px;
}
.fa__icon-btn {
	@apply p-2 text-slate-500;
	height: 18px;
}
.data__row-btn {
	@apply flex items-center justify-start w-fit rounded-md pr-2 bg-slate-200;
}
.data__row-btn:hover {
	@apply bg-slate-300;
}
.urlfield {
	/* inline-size: 150px; */
	word-break: break-all;
}
</style>
