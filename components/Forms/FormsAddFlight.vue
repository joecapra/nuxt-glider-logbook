<template>
	<Form
		@submit="submitForm"
		v-slot="{ errors }"
		:validation-schema="yupSchema.flightSchema"
		:initial-values="formValues"
		class="flex flex-col gap-4"
		ref="formref"
	>
		<div class="text-xl text-slate-600 py-2 mb-4">ADD A FLIGHT</div>
		<div>
			<BaseInput name="date" type="date" label="Date" />
		</div>
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<div class="w-full flex gap-2">
				<BaseInput name="aircraft" type="text" label="Aircraft" />
				<BaseSelect class="pt-5" :options="aircraftOptions" :selected="defaultAircraftId" @onChange="handleAircraftSelected" />
			</div>
			<div class="w-full">
				<BaseInput name="tailnumber" type="text" label="Tail Number" />
			</div>
		</div>
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<div class="w-full flex gap-2">
				<BaseInput name="departure" type="text" label="Departure" placeholder="K" />
				<BaseSelect class="pt-5" :options="airportOptions" :selected="defaultAirportId" @onChange="handleDepartureSelected" />
			</div>
			<div class="w-full flex gap-2">
				<BaseInput name="arrival" type="text" label="Arrival" placeholder="K" />
				<BaseSelect class="pt-5" :options="airportOptions" @onChange="handleArrivalSelected" />
			</div>
		</div>
		<input type="hidden" name="remember" value="true" />
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<BaseInput name="hours" type="text" label="Flight Hours" />
			<BaseInput name="min" type="text" label="Flight Min" />
		</div>
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<BaseInput name="releasealt" type="text" label="Release Alt" />
			<BaseInput name="maxalt" type="text" label="Max Alt" />
		</div>
		<label class="baseinputlabel" for="comments">Comments:</label>
		<Field name="comments" :validateOnChange="false" :validateOnBlur="false" class="baseinputfield" as="textarea" />
		<label class="baseinputlabel" for="flightname">IGC File:</label>
		<BaseDropZone ref="dropZoneRef" @fileDropped="handleFileDropped" :fileTypes="['igc']" />
		<div class="text-left mt-4">
			<BaseSliderButton label="Make this flight public?" onLabel="Yes" v-model="isPublic" />
		</div>
		<div>
			<div class="w-full text-center relative">
				<div
					v-if="Object.entries(errors).length > 0"
					class="w-full text-xs absolute bg-red-600 text-white rounded text-center px-2 py-1 mb-2 -top-4"
				>
					You did not fill out all form fields correctly. Please try again.
				</div>
				<div v-if="modelValue" class="text-slate-600">
					<BasePreloaderDots class="ml-1" size="12px" gap="18px" color="rgb(226 232 240)" highlightColor="rgb(99 102 241)" />
					Adding flight, please wait
				</div>
			</div>
			<div class="flex gap-x-5 mt-8 mb-4 sm:mt-4">
				<BaseButton type="submit" class="w-full">Add Flight</BaseButton>
			</div>
		</div>
	</Form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Form, Field } from 'vee-validate'
import DropZone from '~~/components/Base/BaseDropZone.vue'

/**
 * Composables
 */
const utils = useUtils()
const yupSchema = useYupSchema()

const props = defineProps({
	modelValue: Boolean
})
/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { aircrafts, airports } = storeToRefs(firestoreStore)

/**
 * Emits
 */
const emit = defineEmits(['onSubmit'])

/**
 * Vars
 */
const isPublic = ref(false)
const fileToUpload = ref<File | null>(null)
const dropZoneRef = ref<InstanceType<typeof DropZone> | null>(null)
const formref = ref<InstanceType<typeof Form> | null>(null)
const departureLatLng = ref('')
const defaultAircraftId = ref(0)
const defaultAirportId = ref(0)

/** Setup options for the airport select */
const airportOptions = computed(() => {
	return airports.value.map((airport, index) => {
		/** If this airport is set as default, prepopulate fields and select */
		if (airport.isdefault) {
			defaultAirportId.value = index
			formValues.value.departure = airport.icaocode
		}
		return { name: airport.icaocode, val: airport.icaocode, data: airport.latlng }
	})
})

/** Setup options for the aircraft select */
const aircraftOptions = computed(() => {
	return aircrafts.value.map((aircraft, index) => {
		/** If this aircraft is set as default, prepopulate fields and select */
		if (aircraft.isdefault) {
			defaultAircraftId.value = index
			formValues.value.aircraft = aircraft.type
			formValues.value.tailnumber = aircraft.tailnumber
		}
		return { name: aircraft.type, val: aircraft.tailnumber }
	})
})

/** Initial form field values. They get updated when selects are changed */
const formValues = ref({
	aircraft: '',
	tailnumber: '',
	departure: '',
	arrival: '',
	hours: '',
	min: '',
	releasealt: '',
	maxalt: '',
	comments: ''
})

/**
 * Handlers
 */
const handleAircraftSelected = (selected: SelectOptions): void => {
	formValues.value.aircraft = selected.name.toString()
	formValues.value.tailnumber = selected.val.toString()
}

const handleArrivalSelected = (selected: SelectOptions): void => {
	formValues.value.arrival = selected.val.toString()
}

const handleDepartureSelected = (selected: SelectOptions): void => {
	if (selected.data) {
		departureLatLng.value = selected.data
	}
	formValues.value.departure = selected.val.toString()
}

const handleFileDropped = (file: File): void => {
	fileToUpload.value = file
}

/**
 * Methods
 */

const submitForm = (values: any, { resetForm }: FormActions): void => {
	const { date, aircraft, tailnumber, departure, arrival, hours, min, releasealt, maxalt, comments } = values
	const flight: Flight = {
		flightId: '',
		date: date,
		aircraft: aircraft,
		tailnumber,
		departure: departure,
		departurelatlng: departureLatLng.value,
		arrival: arrival,
		flighttime: utils.convertToMinutes(hours, min),
		igcfile: '',
		ispublic: isPublic.value,
		releasealt,
		maxalt,
		comments: comments ? comments : ''
	}
	resetForm()
	/** Clear the dropzone */
	dropZoneRef.value?.clear()
	emit('onSubmit', flight, fileToUpload.value)
}

const clear = (): void => {
	isPublic.value = false
	formref.value?.resetForm()
	/** Clear the dropzone */
	dropZoneRef.value?.clear()
}

defineExpose({
	clear
})
</script>

<style scoped>
.btn__primary {
	@apply whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
