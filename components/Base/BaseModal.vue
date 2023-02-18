<template>
	<!-- Container -->
	<Teleport to="body">
		<transition name="modal-animation">
			<div v-if="modelValue" class="fixed left-0 top-0 w-screen h-screen p-6 flex flex-col justify-center items-center">
				<!-- Background cover -->
				<div class="absolute w-full h-full bg-slate-800/[.8] cursor-pointer" @click="emit('update:modelValue', false)"></div>
				<!-- Content Card -->
				<transition name="modal-animation-inner" appear>
					<div
						v-if="modelValue"
						class="relative w-auto px-4 pt-[35px] pb-4 bg-gray-50 rounded-xl flex flex-col items-center shadow-lg sm:p-10"
					>
						<button class="closebtn absolute top-2 right-2 flex justify-start items-center" @click="emit('update:modelValue', false)">
							<font-awesome-icon
								:icon="closeIcon"
								@mouseover="closeIcon = ['fa', 'circle-xmark']"
								@mouseout="closeIcon = ['far', 'circle-xmark']"
								class="icon fa-lg"
							/>
						</button>
						<!-- Modal content slot -->
						<slot />
					</div>
				</transition>
			</div>
		</transition>
	</Teleport>
</template>

<script setup lang="ts">
/**
 * Vars
 */
/**
 * Props
 */
const props = defineProps<{
	modelValue: boolean
}>()

const closeIcon = ref(['far', 'circle-xmark'])

/**
 * Props
 */
// const props = defineProps({
// 	open: Boolean
// })

/**
 * Emits
 */
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
	transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
	opacity: 0;
}
.modal-animation-inner-enter-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-animation-inner-leave-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-inner-enter-from {
	opacity: 0;
	transform: scale(0.8);
}
.modal-animation-inner-leave-to {
	transform: scale(0.8);
}
</style>
