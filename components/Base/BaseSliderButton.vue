<template>
	<div class="flex align-center justify-start gap-2 p-2">
		<span class="text-slate-600">{{ props.label }}</span>
		<label class="inline-flex relative items-center cursor-pointer">
			<input type="checkbox" value="" :checked="modelValue" class="sr-only peer" @click="handleToggle" />
			<div
				class="w-11 h-6 bg-indigo-200 rounded-full peer dark:peer-focus:ring-indigo-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"
			></div>
			<span class="ml-1 text-sm font-medium text-slate-600">{{ onLabel }}</span>
		</label>
	</div>
</template>

<script setup lang="ts">
/**
 * Events
 */
const emit = defineEmits(['update:modelValue'])

const props = defineProps<{ label: string; onLabel: string; modelValue: boolean }>()

/**
 * Methods
 */
const handleToggle = (): void => {
	emit('update:modelValue', !props.modelValue)
}
</script>
