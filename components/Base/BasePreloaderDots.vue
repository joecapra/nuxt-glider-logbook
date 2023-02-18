<template>
	<div>
		<span class="dotloader" :style="cssProps"></span>
	</div>
</template>

<script setup>
/**
 * Props
 */
const props = defineProps({
	color: { type: String, default: 'green' },
	highlightColor: { type: String, default: 'red' },
	size: { type: String, default: '16px' },
	gap: { type: String, default: '25px' }
})

const cssProps = computed(() => {
	return {
		'--color': props.color,
		'--highlightColor': props.highlightColor,
		'--size': props.size,
		'--gap': props.gap
	}
})
</script>

<style scoped>
.dotloader {
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	display: block;
	margin: 0 auto;
	position: relative;
	background: var(--color);
	box-shadow: calc(var(--gap) * -1) 0 var(--color), var(--gap) 0 var(--color);
	box-sizing: border-box;
	animation: shadowPulse 1s linear infinite;
}

@keyframes shadowPulse {
	33% {
		background: var(--color);
		box-shadow: calc(var(--gap) * -1) 0 var(--highlightColor), var(--gap) 0 var(--color);
	}
	66% {
		background: var(--highlightColor);
		box-shadow: calc(var(--gap) * -1) 0 var(--color), var(--gap) 0 var(--color);
	}
	100% {
		background: var(--color);
		box-shadow: calc(var(--gap) * -1) 0 var(--color), var(--gap) 0 var(--highlightColor);
	}
}
</style>
