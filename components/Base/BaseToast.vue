<template>
	<Teleport to="body">
		<transition name="modal-animation">
			<div v-if="toast.isOpen" class="fixed left-0 top-0 w-full flex justify-center">
				<div
					class="relative rounded-b-xl w-3/4 h-[40px] p-6 flex flex-col justify-center items-center text-slate-100"
					:class="[toast.color === 'red' ? 'bg-red-600' : 'bg-green-600']"
				>
					<button class="closebtn absolute top-2 right-2 flex justify-start items-center">
						<font-awesome-icon
							:icon="closeIcon"
							@mouseover="closeIcon = ['fa', 'circle-xmark']"
							@mouseout="closeIcon = ['fa', 'circle-xmark']"
							class="icon fa-lg"
							@click="handleClose"
						/>
					</button>
					{{ toast.message }}
				</div>
			</div>
		</transition>
	</Teleport>
</template>

<script setup lang="ts">
/**
 * Vars
 */
const closeIcon = ref(['fa', 'circle-xmark'])
const toast = useToastState()
/**
 * Props
 */
const props = defineProps({
	open: Boolean
})

/**
 * Emits
 */
const emit = defineEmits(['closemodal'])

const handleClose = (): void => {
	toast.value = {
		isOpen: false,
		message: '',
		autoClose: true,
		color: 'red'
	}
}
</script>

<style scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
	transition: top 0.5s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
	top: -50px;
}
</style>
