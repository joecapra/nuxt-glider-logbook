<template>
	<div class="w-full flex flex-col items-center my-6">
		<div
			class="transition-height ease-in-out duration-500 h-0 overflow-hidden w-full border bg-slate-100 border-slate-200 rounded-xl shadow-lg"
			:style="[isOpen ? { height: expandHeight + 'px' } : {}]"
		>
			<div ref="formRef" class="w-full p-6">
				<div class="flex justify-between mb-4">
					<div class="text-xl text-slate-600 w-full">EDIT FLIGHT</div>
					<BaseButton @click="handleClose" type="button">Close Form</BaseButton>
				</div>
				<FormsEditFlight :flight="props.flight" v-model="formSubmitting" @onSubmitSuccess="edit" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Composables
 */
const firestoreFlights = useFirestoreFlights()

/**
 * Emits
 */
const emit = defineEmits(['flightEdited', 'wasClosed'])

/**
 * Props
 */
const props = defineProps<{ open: boolean; flight: Flight }>()

/**
 * Vars
 */
const formSubmitting = ref(false)
const isOpen = ref(false)
const formRef = ref<HTMLElement | null>(null)
const expandHeight = ref(0)

/**
 * Methods
 */

/** Handles manual close of the form */
const handleClose = (): void => {
	isOpen.value = false
	emit('wasClosed', true)
}

const edit = async (flight: Flight, igcfile: File): Promise<void> => {
	formSubmitting.value = true
	try {
		const editedFlight = await firestoreFlights.editFlight(flight, igcfile)
		emit('flightEdited', editedFlight)
		handleClose()
		formSubmitting.value = false
		window.scrollTo(0, 0)
		useToast(`Flight has been updated!`, true, 'green')
	} catch (error) {
		formSubmitting.value = false
		if (error instanceof Error) {
			useToast(`Error editing flight: ${error.message}`)
		}
	}
}

/**
 * Watchers
 */
watchEffect(() => {
	const formHeight = formRef.value?.scrollHeight
	expandHeight.value = formHeight || 0
})

/** Watch for open prop to change in order to open the form*/
watch(
	() => props.open,
	(currentVal) => {
		isOpen.value = currentVal
	}
)
</script>

<style scoped>
input {
	border: 1px solid black;
}
</style>
