<template>
	<BaseCard>
		<div class="font-bold text-slate-600 px-1 mb-4">Logbook Stats</div>
		<div class="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-4">
			<FlightStatCard title="Total Flights:" :value="totalFlights" />
			<FlightStatCard title="Total Flight time:" :value="totalTime" />
			<FlightStatCard title="Longest Flight:" :value="longestFlight" />
			<FlightStatCard title="Most Flown Airport:" :value="mostFlownAirport" />
			<FlightStatCard title="Most Flown Aircraft:" :value="mostFlownAircraft" />
			<FlightStatCard title="Most Alt Gain:" :value="mostAltGain" />
		</div>
	</BaseCard>
</template>

<script setup lang="ts">
const utils = useUtils()

/**
 * Props
 */
const props = defineProps<{ flightsArr: Flight[] }>()

/**
 * Vars
 */
const totalTime = computed(() => {
	const totalTimeNum = props.flightsArr.reduce((acc, cur) => {
		const flightTimeAsNumber = parseInt(cur.flighttime)
		return acc + flightTimeAsNumber
	}, 0)
	const totalTimeStr = utils.convertMinutesToTime(totalTimeNum.toString(), 'full')
	const splitTime = totalTimeStr.split(':')
	return `${splitTime[0]}hr ${splitTime[1]}min`
})

const totalFlights = computed(() => {
	return props.flightsArr.length.toString()
})

const longestFlight = computed(() => {
	const longestFlightDur = props.flightsArr.reduce((acc, cur) => {
		const flightTimeAsNumber = parseInt(cur.flighttime)
		return flightTimeAsNumber > acc ? flightTimeAsNumber : acc
	}, 0)
	const longestFlightStr = utils.convertMinutesToTime(longestFlightDur.toString(), 'full')
	const splitTime = longestFlightStr.split(':')
	return `${splitTime[0]}hr ${splitTime[1]}min`
})

const mostFlownAirport = computed(() => {
	const counts = getCountsByKey('departure')
	const countsArr = Object.entries(counts)
	const mostFlownAirport = countsArr.reduce((acc, cur) => (cur[1] > acc[1] ? cur : acc), ['', 0])
	const count = mostFlownAirport[1]
	return count > 0 ? `${mostFlownAirport[0]}: ${mostFlownAirport[1]} ${count === 1 ? 'Flight' : 'Flights'}` : 'N/A'
})

const mostFlownAircraft = computed(() => {
	const counts = getCountsByKey('aircraft')
	const countsArr = Object.entries(counts)
	const mostFlownAircraft = countsArr.reduce((acc, cur) => (cur[1] > acc[1] ? cur : acc), ['', 0])
	const count = mostFlownAircraft[1]
	return count > 0 ? `${mostFlownAircraft[0]}: ${mostFlownAircraft[1]} ${count === 1 ? 'Flight' : 'Flights'}` : 'N/A'
})

const mostAltGain = computed(() => {
	const mostAltGain = props.flightsArr.reduce((acc, cur) => {
		const altGain = parseInt(cur.maxalt) - parseInt(cur.releasealt)
		if (altGain > acc) return altGain
		return acc
	}, 0)
	return `${mostAltGain} ft`
})

/**
 * Counts occurances by specified key in flights array
 * Return object with key and count. { 'IYK': 5, 'SMO': 1} or { 'ASK21': 5, 'ASW28': 1}
 */
function getCountsByKey(forKey: keyof Flight): StatCounts {
	const counts: StatCounts = {}

	for (const flightObj of props.flightsArr) {
		const key = flightObj[forKey]
		/** We only want to work with strings here */
		if (typeof key === 'string') {
			if (counts[key]) {
				counts[key] += 1
			} else {
				counts[key] = 1
			}
		}
	}
	return counts
}
</script>
