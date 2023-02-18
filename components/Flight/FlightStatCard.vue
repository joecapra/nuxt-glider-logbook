<template>
	<div class="container p-4 bg-gray-100 text-slate-500 rounded-xl flex flex-col items-start shadow-lg text-sm">
		<span class="font-bold">{{ props.title }}</span>
		<div>{{ props.value }}</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; value: string }>()
</script>
