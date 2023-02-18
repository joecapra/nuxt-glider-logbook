<template>
	<div
		ref="dropZoneRef"
		class="border-2 border-slate-400 border-dashed flex flex-col w-full bg-slate-200 h-32 bg-gray-400/10 justify-center items-center"
		:class="{ 'border-slate-800 bg-slate-300': isOverDropZone || filesData.length > 0 }"
	>
		<span
			>Drop {{ props.fileTypes.toString() }} file here or
			<a type="button" @click="open()" class="underline cursor-pointer">Choose file</a></span
		>
		<img :src="`/images/${fileIcon}.svg`" alt="IGC" class="h-8" />
		<div class="flex flex-wrap justify-center items-center">
			<div v-for="(file, index) in filesData" :key="index" class="w-200px bg-black-200/10 ma-2 pa-6">
				<p>Name: {{ file.name }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core'
/**
 * Vars
 */
const { files, open, reset } = useFileDialog()

const filesData = ref<{ name: string }[]>([])
const dropZoneRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const props = defineProps<{ fileTypes: string[] }>()
const fileIcon = computed(() => {
	if (props.fileTypes.includes('igc')) return 'icon_igc_file'
	return 'icon_img_file'
})
/**
 * Emits
 */
const emit = defineEmits(['fileDropped'])

/**
 * Methods
 */

const clear = (): void => {
	reset()
	filesData.value = []
}

const checkFileType = (fileExtension: string, typesArr: string[]): boolean => {
	return typesArr.includes(fileExtension)
}

function onDrop(files: File[] | null) {
	filesData.value = []
	if (files && files.length > 1) {
		alert('You can only upload one igc file.')
		return
	} else if (files && files.length === 1) {
		/** Check for valid .igc file */
		const fileName = files[0].name
		const extension = fileName.substring(fileName.lastIndexOf('.') + 1)

		if (!checkFileType(extension, props.fileTypes)) {
			alert(`Not a valid ${props.fileTypes.toString()} file`)
			return
		}

		filesData.value = files.map((file) => ({
			name: file.name
		}))

		emit('fileDropped', files[0])
	}
	return
}

/**
 * Watchers
 */

/** Watch for manual/browse file selection */
watch(files, () => {
	const filesArr = Array.from(files.value || [])
	onDrop(filesArr)
})

defineExpose({
	clear
})
</script>
