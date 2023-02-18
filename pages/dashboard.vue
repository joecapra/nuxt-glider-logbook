<template>
	<head>
		<title>LB - {{ fullName }}'s Dashboard</title>
	</head>
	<div class="container mx-auto w-11/12 bg-slate-600 text-slate-100 text-2xl rounded shadow-lg md:max-w-screen-lg pl-8 py-3 mb-4">
		<font-awesome-icon icon="fa-solid fa-house" class="pr-2" /> DASHBOARD
	</div>
	<BaseCard>
		<FlightAdd @flightAdded="handleFlightAdded" />
		<div class="w-full">
			<div class="text-slate-500">{{ randomAirport?.departure }}</div>
			<BaseAirportMap :latlng="randomAirport?.departurelatlng" zoom="14" :mapHeight="400" class="h-full w-full sm:h-[443px]" />
		</div>
		<div class="w-full">
			<div class="w-full flex flex-col justify-center items-center pt-4 lg:flex-row gap-4">
				<input
					name="search"
					type="text"
					class="relative block grow appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-500 placeholder-slate-200 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-slate-500 w-full"
					placeholder="Search"
					v-model="searchTerm"
				/>
				<SortBar v-model="activeSort" class="md:w-full" />
			</div>
			<BasePreloader v-if="!flightsLoaded" class="relative bg-transparent h-24" circleColor="#cbd5e1" />
			<template v-else>
				<FlightListRow
					v-for="(flight, index) in filteredFlights"
					:key="flight.flightId"
					:flight="flight"
					:style="{ backgroundColor: index % 2 !== 0 ? 'white' : '#f5f5f5' }"
				/>
			</template>
			<FlightListNoFlights v-if="flightsLoaded && !filteredFlights.length" />
			<PaginationBar
				:totalItems="totalFilteredFlights"
				:itemsPerPage="flightsPerPage"
				@pageClicked="handlePageClicked"
				@flightsPerPageChange="handleFlightsPerPageChange"
			/>
		</div>
	</BaseCard>
	<FlightStats class="mt-4" :flightsArr="flights" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

/**
 * Set page meta/middleware
 */
definePageMeta({
	middleware: 'auth'
})

/**
 * Vars
 */
const utils = useUtils()
const sortByState = useSortByState()
const sortDirState = useSortDirState()

const activeSort = ref<ActiveSort>({ sortBy: sortByState.value, sortDir: sortDirState.value })

// Get the current page from global state
const currentPage = useCurrentPage()
const flightsPerPage = ref(5)
const totalFilteredFlights = ref(0)
const searchTerm = ref('')
const flightsLoading = ref(true)

/** ***********************************************************************
 * Get/Watch user in firestoreStore. User has to be in firestoreStore before
 * we can do anything
 ************************************************************************* */
const firestoreStore = useFirestoreStore()
const { user, flights, flightsLoaded } = storeToRefs(firestoreStore)
const fullName = computed(() => `${user.value.firstname} ${user.value.lastname}`)

/** Filter flights based on search term */
const filteredFlights = computed(() => {
	/** Convert search term to lowercase for case insensitivity */
	const term = searchTerm.value.toLowerCase()

	/** Filter flights based on search term */
	const filtered = flights.value.filter((flightObj) => {
		for (const [key, value] of Object.entries(flightObj)) {
			/** We do not want include the igcfile or ispublic property when searching/filtering*/
			if (key !== 'igcfile' && key !== 'ispublic' && key !== 'flightId' && key !== 'departurelatlng' && key !== 'comments') {
				/** Convert property value to lowercase for case insensitivity */
				if (typeof value === 'string') {
					const val = value.toLowerCase()
					if (val.includes(term)) return flightObj
				}
				/** Return the whole flight object if any prop values include search term */
			}
		}
	})
	/** The total number of flights found after filtering */
	totalFilteredFlights.value = filtered.length

	/** Calculate the start and end index for the current page */
	const startIndex = flightsPerPage.value * currentPage.value
	const endIndex = startIndex + flightsPerPage.value

	/** Now we can sort our results passing in the filtered results */
	const sortedFlights = handleSortFlights(activeSort.value, filtered)
	/** Slice our filtered array to get just the items needed for the current page */
	const filteredSortedAndSliced = sortedFlights.slice(startIndex, endIndex)
	/** Return filtered and sorted flights */
	flightsLoading.value = false
	return filteredSortedAndSliced
})

/**
 * Get random lat/long for hero map
 */
const randomAirport = computed(() => {
	const filtered = flights.value.filter((flight) => !!flight.departurelatlng)

	/** Wait for flights to be loaded and show a default if use has no flights */
	if (flightsLoading.value === false && !filtered.length) {
		return { departure: 'IYK', departurelatlng: '35.658012,-117.82984' }
	}

	return filtered[Math.floor(Math.random() * filtered.length)]
})

/**
 * Handlers
 */
const handlePageClicked = (pageNumClicked: number): void => {
	currentPage.value = pageNumClicked
}

function handleSortFlights(activeSort: ActiveSort, flightsArr: Flight[] = filteredFlights.value): Flight[] {
	const { sortBy, sortDir } = activeSort
	console.log(`page:dashboard:handleSortFlights - sortDir: ${sortDir} sortBy: ${sortBy}`)
	sortByState.value = sortBy
	sortDirState.value = sortDir

	/** Actually sort the flights array */
	const sorted = utils.sortFlights(flightsArr, sortBy, sortDir)
	return sorted
}

const handleFlightAdded = (): void => {
	window.scrollTo(0, 0)
}

const handleFlightsPerPageChange = (num: number): void => {
	currentPage.value = 0
	flightsPerPage.value = num
}

/**
 * Watchers
 */

/**
 * Watch for change in search term. We need to set the current page
 * back to zero when we start searching/filtering
 */
watch(searchTerm, () => (currentPage.value = 0))
</script>

<style scoped>
::placeholder {
	/* Chrome, Firefox, Opera, Safari 10.1+ */
	@apply text-slate-500;
	opacity: 1;
}
</style>
