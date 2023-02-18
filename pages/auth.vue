<template>
	<div
		class="bg-slate-200 w-full grow flex justify-center items-center"
		:style="{
			backgroundSize: 'cover',
			backgroundOrigin: 'content-box',
			backgroundImage: `url('/images/backgrounds/${randomBg}')`
		}"
	>
		<FormsAuth />
	</div>
</template>

<script lang="ts" setup>
/**
 * Set layout
 */
definePageMeta({ layout: 'auth' })
const firestoreStore = useFirestoreStore()
firestoreStore.clearStore()

/**
 * Vars
 */
const bgImages = ['bg1.webp', 'bg2.webp', 'bg3.webp', 'bg4.webp', 'bg5.webp']
const randomBg = ref(getRandomBg())

/**
 * Methods
 */
function getRandomBg(): string {
	const randomNum = Math.floor(Math.random() * (4 - 0) + 0)
	return bgImages[randomNum]
}
</script>
