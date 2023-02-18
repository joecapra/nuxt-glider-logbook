<template>
	<div class="w-full flex flex-col items-center mb-6">
		<div class="flex w-full justify-end mb-4">
			<BaseButton v-if="!isExpanded" @click="toggle" type="button">Add Flight</BaseButton>
			<BaseButton v-else @click="toggle" type="button">Close Form</BaseButton>
		</div>
		<div
			ref="formRef"
			class="transition-height ease-in-out duration-500 h-0 overflow-hidden w-full border bg-slate-100 border-slate-200 rounded-xl shadow-lg"
			:style="[isExpanded ? { height: expandHeight + 'px' } : {}]"
		>
			<div class="w-full p-6">
				<FormsAddFlight ref="addFlightFormRef" v-model="formSubmitting" @onSubmit="add" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import FormsAddFlight from '~~/components/Forms/FormsAddFlight.vue'
/**
 * Composables
 */
const firestoreFlights = useFirestoreFlights()

/**
 * Emits
 */
const emit = defineEmits(['flightAdded'])

/**
 * Vars
 */
const formSubmitting = ref(false)
const addFlightFormRef = ref<InstanceType<typeof FormsAddFlight> | null>(null)
const isExpanded = useState('isExpanded', () => {
	return false
})
const formRef = ref<HTMLElement | null>(null)
const expandHeight = ref(0)

/**
 * Methods
 */
const toggle = () => {
	addFlightFormRef.value?.clear()
	isExpanded.value = !isExpanded.value
}

const add = async (flight: Flight, igcfile: File): Promise<void> => {
	formSubmitting.value = true
	await firestoreFlights.addFlight(flight, igcfile)
	isExpanded.value = false
	formSubmitting.value = false
	emit('flightAdded')
	useToast(`New flight has been added!`, true, 'green')
}

/**
 * Watchers
 */
watchEffect(() => {
	const formHeight = formRef.value?.scrollHeight
	expandHeight.value = formHeight || 0
})
</script>

<style scoped>
input {
	border: 1px solid black;
}
</style>
