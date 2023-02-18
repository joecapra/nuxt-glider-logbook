<template>
	<div class="border-t border-slate-200 pt-4 mt-6">
		<div class="w-full flex items-center gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
			<div class="">
				<p class="text-sm text-slate-500">
					Showing
					<span class="font-medium">{{ showingFromNum }}</span>
					-
					<span class="font-medium">{{ showingToNum }}</span>
					of
					<span class="font-medium">{{ totalItems }}</span>
					Flights
				</p>
			</div>
			<!-- class="relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20" -->
			<PaginationPerPageSelect @onChange="handleFlightsPerPageChange" />
			<div>
				<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						:disabled="currentPage < 1"
						@click="handlePageClick(currentPage - 1)"
						class="relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20"
						:class="[currentPage < 1 ? 'opacity-30' : '']"
					>
						<span class="sr-only">Previous</span>
						<!-- Heroicon name: mini/chevron-left -->
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
					<!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-slate-300 text-slate-500 hover:bg-slate-50" -->
					<button
						v-for="pageNum in totalPages"
						@click="handlePageClick(pageNum - 1)"
						:class="[currentPage === pageNum - 1 ? 'btn--active' : 'btn--inactive']"
					>
						{{ pageNum }}
					</button>

					<button
						:disabled="currentPage === totalPages - 1"
						@click="handlePageClick(currentPage + 1)"
						href="#"
						class="relative inline-flex items-center rounded-r-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20"
						:class="[currentPage === totalPages - 1 ? 'opacity-30' : '']"
					>
						<span class="sr-only">Next</span>
						<!-- Heroicon name: mini/chevron-right -->
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Emits
 */
const emit = defineEmits(['pageClicked', 'flightsPerPageChange'])

/**
 * Props
 */
const props = defineProps<{
	totalItems: number
}>()

/**
 * Vars
 */
const itemsPerPage = ref(5)

const totalPages = computed(() => {
	return Math.ceil(props.totalItems / itemsPerPage.value)
})

// Get the current page from global state
const currentPage = useCurrentPage()

/** Calculate the #FROM number for "showing #FROM to #TO of x flights" */
const showingFromNum = computed(() => itemsPerPage.value * currentPage.value + 1)
/** Calculate the #TO number for "showing #FROM to #TO of x flights" */
const showingToNum = computed(() => {
	const toNum = showingFromNum.value + itemsPerPage.value - 1
	return props.totalItems < itemsPerPage.value ? props.totalItems : toNum > props.totalItems ? props.totalItems : toNum
})

/**
 * Handlers
 */
const handlePageClick = (clickedPageNum: number): void => {
	currentPage.value = clickedPageNum
	emit('pageClicked', clickedPageNum)
}

const handleFlightsPerPageChange = (perPage: number): void => {
	itemsPerPage.value = perPage
	emit('flightsPerPageChange', perPage)
}
</script>

<style scoped>
.btn--inactive {
	@apply relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20;
}
.btn--active {
	@apply relative z-10 inline-flex items-center border border-slate-500 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 focus:z-20;
}
</style>
