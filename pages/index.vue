<template>
	<div class="bg-slate-200 w-full h-full"><BasePreloader /></div>
</template>

<script lang="ts" setup>
const firestoreStore = useFirestoreStore()
definePageMeta({
	layout: false,
	middleware: 'auth'
})
</script>
