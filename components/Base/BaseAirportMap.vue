<template>
	<div class="bg-slate-200 relative">
		<img v-if="mapUrl" :src="mapUrl" @load="handleMapLoaded" width="100%" height="100%" class="max-h-[443px]" />
		<BasePreloader v-if="mapUrl" :isLoaded="isLoaded" :size="props.preloaderSize" />
		<div v-if="!airportFound" class="bg-slate-200 w-full h-full flex justify-center items-center">
			<font-awesome-icon class="h-1/2 text-slate-400" icon="fa-solid fa-plane-slash" />
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
	latlng: {
		type: String,
		default: ''
	},
	icaocode: {
		type: String,
		default: ''
	},
	mapWidth: {
		type: Number,
		default: 1000
	},
	mapHeight: {
		type: Number,
		default: 400
	},
	zoom: {
		type: String,
		default: '3'
	},
	preloaderSize: {
		type: String,
		default: 'large'
	}
})

/**
 * Vars
 */
const runtimeConfig = useRuntimeConfig()
const utils = useUtils()
const airportFound = ref(false)
const isLoaded = ref(false)

/**
 * Methods
 */
const generateMapUrl = async (): Promise<string> => {
	let latlngStr = ''
	/** If an icao code is passed in use that */
	if (props.icaocode) {
		latlngStr = await utils.getAirportLatLng(props.icaocode)
		/** else if lat long was passed in use that */
	} else if (props.latlng) {
		latlngStr = props.latlng
	} else {
		/** No icao code passed in or latlng == '' */
		isLoaded.value = true
		console.log(`component:AirportMap - ERROR fetching airport data. Likely it does not exist in the database`)
		return latlngStr
	}

	airportFound.value = true
	return `https://maps.googleapis.com/maps/api/staticmap?center=${latlngStr}&zoom=${props.zoom}&size=${props.mapWidth}x${props.mapHeight}&scale=2&maptype=satellite&key=${runtimeConfig.public.staticMapsApiKey}`
}

const mapUrl = ref('')
mapUrl.value = await generateMapUrl()

/**
 * Handlers
 */
const handleMapLoaded = () => {
	isLoaded.value = true
}

/**
 * Watchers
 */

/** Watch for props (mainly latlng) to change. Regenerate mapurl if they do */
watchEffect(async () => {
	isLoaded.value = false
	mapUrl.value = await generateMapUrl()
})
</script>

<style scoped>
img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
