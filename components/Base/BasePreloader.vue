<template>
	<div
		class="preloader__loading absolute top-0 w-full h-full bg-slate-200 flex justify-center items-center"
		:class="{ preloader__isloaded: isLoaded }"
		@transitionend="onTransitionComplete"
		v-if="!transitionComplete"
	>
		<span :class="[props.size === 'small' ? 'preloader__loader--small' : 'preloader__loader--large']" :style="cssProps"></span>
	</div>
</template>

<script setup>
/**
 * Vars
 */
const isLoaded = ref(props.isLoaded)
const transitionComplete = ref(props.transitionComplete)

/**
 * Props
 */
const props = defineProps({
	isLoaded: Boolean,
	transitionComplete: Boolean,
	size: { type: String, default: 'large' },
	circleColor: { type: String, default: 'white' }
})

const cssProps = computed(() => {
	return {
		'--color': props.circleColor
	}
})

/**
 * Methods
 */
watch(
	() => props.isLoaded,
	(newVal) => {
		isLoaded.value = newVal
	}
)

const onTransitionComplete = () => {
	transitionComplete.value = true
}
</script>

<style scoped>
.preloader__loading {
	opacity: 1;
	transition: 0.5s;
}
.preloader__isloaded {
	opacity: 0;
}
.transitioncomplete {
	display: none !important;
}
.preloader__loader--large {
	width: 48px;
	height: 48px;
	border: 5px solid var(--color);
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	position: relative;
	animation: pulse 1s linear infinite;
}
.preloader__loader--small {
	width: 28px;
	height: 28px;
	border: 3px solid var(--color);
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	position: relative;
	animation: pulse 1s linear infinite;
}
.preloader__loader--large:after {
	content: '';
	position: absolute;
	width: 48px;
	height: 48px;
	border: 5px solid var(--color);
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	animation: scaleUp 1s linear infinite;
}
.preloader__loader--small:after {
	content: '';
	position: absolute;
	width: 48px;
	height: 48px;
	border: 5px solid var(--color);
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	animation: scaleUp 1s linear infinite;
}

@keyframes scaleUp {
	0% {
		transform: translate(-50%, -50%) scale(0);
	}
	60%,
	100% {
		transform: translate(-50%, -50%) scale(1);
	}
}
@keyframes pulse {
	0%,
	60%,
	100% {
		transform: scale(1);
	}
	80% {
		transform: scale(1.2);
	}
}
</style>
