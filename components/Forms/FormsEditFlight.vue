<template>
	<Form
		@submit="submitForm"
		v-slot="{ errors }"
		:validation-schema="yupSchema.flightSchema"
		:initial-values="formValues"
		class="flex flex-col gap-4"
	>
		<div>
			<BaseInput name="date" type="date" label="Date" />
		</div>
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<div class="w-full flex gap-2">
				<BaseInput name="aircraft" type="text" label="Aircraft" />
				<BaseSelect class="pt-5" :options="aircraftOptions" @onChange="handleAircraftSelected" />
			</div>
			<div class="w-full">
				<BaseInput name="tailnumber" type="text" label="Tail Number" />
			</div>
		</div>
		<div class="w-full flex flex-col gap-4 sm:flex-row">
			<div class="w-full flex gap-2">
				<BaseInput name="departure" type="text" label="Departure" />
				<BaseSelect class="pt-5" :options="airportOptions" @onChange="handleDepartureSelected" />
			</div>
			<div class="w-full flex gap-2">
				<BaseInput name="arrival" type="text" label="Arrival" />
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
		<label class="baseinputlabel" for="comments">Comments: <ErrorMessage name="comments" class="form__validation-error-msg" /></label>
		<Field name="comments" :validateOnChange="false" :validateOnBlur="false" class="baseinputfield" as="textarea" />
		<div>
			<label class="baseinputlabel" for="flightname">IGC File:</label>
			<BaseDropZone @fileDropped="handleFileDropped" :fileTypes="['igc']" />
		</div>
		<div class="text-left">
			<BaseSliderButton v-model="localFlight.ispublic" label="Make this flight public?" onLabel="Yes" />
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
					Editing flight, please wait
				</div>
			</div>
			<div class="flex gap-x-5 mt-8 mb-4 sm:mt-4">
				<BaseButton type="submit" class="w-full">Edit Flight</BaseButton>
			</div>
		</div>
	</Form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Form, Field, ErrorMessage } from 'vee-validate'

/**
 * Composables
 */
const utils = useUtils()
const yupSchema = useYupSchema()

/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { aircrafts, airports } = storeToRefs(firestoreStore)

/**
 * Props
 */
const props = defineProps<{ flight: Flight; modelValue: Boolean }>()

/**
 * Emits
 */
const emit = defineEmits(['onSubmitSuccess'])

/**
 * Vars
 */
const fileToUpload = ref<File | null>(null)
const localFlight = ref({ ...props.flight })
const isPublic = ref(localFlight.value.ispublic)

/** Setup options for the airport select */
const airportOptions = computed(() => {
	return airports.value.map((airport) => {
		return { name: airport.icaocode, val: airport.icaocode }
	})
})

/** Setup options for the aircraft select */
const aircraftOptions = computed(() => {
	return aircrafts.value.map((aircraft) => {
		return { name: aircraft.type, val: aircraft.tailnumber }
	})
})

/** Initial form field values */
const formValues = computed(() => {
	return {
		date: localFlight.value.date,
		aircraft: localFlight.value.aircraft,
		tailnumber: localFlight.value.tailnumber,
		departure: localFlight.value.departure,
		arrival: localFlight.value.arrival,
		releasealt: localFlight.value.releasealt,
		maxalt: localFlight.value.maxalt,
		min: utils.convertMinutesToTime(localFlight.value.flighttime, 'm'),
		hours: utils.convertMinutesToTime(localFlight.value.flighttime, 'h'),
		comments: localFlight.value.comments
	}
})

/**
 * Handlers
 */
const handleFileDropped = (file: File): void => {
	fileToUpload.value = file
}

const handleAircraftSelected = (selected: SelectOptions): void => {
	localFlight.value.aircraft = selected.name.toString()
	localFlight.value.tailnumber = selected.val.toString()
}

const handleArrivalSelected = (selected: SelectOptions): void => {
	localFlight.value.arrival = selected.val.toString()
}

const handleDepartureSelected = (selected: SelectOptions): void => {
	localFlight.value.departure = selected.val.toString()
}

/**
 * Methods
 */
// const togglePublicPrivate = (isChecked: boolean): void => {
// 	isPublic.value = isChecked
// }

const submitForm = (values: any, { resetForm }: FormActions): void => {
	const { date, aircraft, tailnumber, departure, arrival, hours, min, releasealt, maxalt, comments } = values
	const flight: Flight = {
		flightId: props.flight.flightId,
		date: date,
		aircraft: aircraft,
		tailnumber,
		departure: departure,
		departurelatlng: '',
		arrival: arrival,
		flighttime: utils.convertToMinutes(hours, min),
		igcfile: props.flight.igcfile,
		ispublic: localFlight.value.ispublic,
		releasealt,
		maxalt,
		comments
	}
	resetForm()
	emit('onSubmitSuccess', flight, fileToUpload.value)
}

/**
 * Watchers
 */
// watchEffect(() => {
// 	isPublic.value = props.flight.ispublic
// })
</script>

<style scoped>
.btn__primary {
	@apply whitespace-nowrap relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
