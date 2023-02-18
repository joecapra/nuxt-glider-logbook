/** *******************************************************************************
 * Various utils
 * ***************************************************************************** */

const useUtils = () => {
	/**
	 * Converts hours and minutes to total minutes
	 */
	const copyToClipboard = (text: string): void => {
		navigator.clipboard.writeText(text)
	}
	/**
	 * Converts hours and minutes to total minutes
	 */
	const convertToMinutes = (h: string | undefined, m: string | undefined): string => {
		if (h && m) {
			const hs = parseInt(h)
			const ms = parseInt(m)
			return `${hs * 60 + ms}`
		}
		return ''
	}

	/**
	 * Converts minutes to hours and minutes
	 */
	const convertMinutesToTime = (m: string | undefined, returnVal: 'h' | 'm' | 'full' = 'full'): string => {
		if (!m) return '0:00'

		const ms = parseInt(m)
		const hours = ms / 60
		const rhours = Math.floor(hours)
		const minutes = (hours - rhours) * 60
		const rminutes = Math.round(minutes)
		if (returnVal == 'h') return rhours.toString()
		if (returnVal == 'm') return rminutes.toString()
		return `${rhours}:${rminutes}`
	}

	/**
	 * Hit airport database to get departure airport lat/lng
	 */
	const getAirportLatLng = async (icocode: string): Promise<string> => {
		/** Hit the airports api to look up airport and get lat/lng if the it was found in the database */
		const runtimeConfig = useRuntimeConfig()
		const { data, error } = await useFetch<{ [key: string]: string | number }[]>(
			`${runtimeConfig.public.apiUrl}/airportdata?icaocode=${icocode}`
		)
		console.log(`useUtils:getAirportLatLng - AIRPORT DATA:`, data)
		if (error.value) {
			throw createError({ ...error.value, statusMessage: 'There was an error fetching airport data' })
		}

		const airportdata = data.value
		/** If the airportdata array has something in it then we found lat/long for the airport */
		if (airportdata && airportdata.length > 0) {
			const data = airportdata[0]
			return `${data.lat},${data.lng}`
		}
		return ''
	}

	/**
	 * Sort flights array based on sortBy(date, aircraft, flight time, etc) and orderBy (direction asc, desc)
	 */
	const sortFlights = (flightsArr: Flight[] = [], sortBy: keyof Flight, sortDir: string): Flight[] => {
		console.log(`useUtils:sortFlights - sortBy:${sortBy} sortDir:${sortDir} arr:`, flightsArr)
		const newArr = [...flightsArr]

		newArr.sort((a, b) => {
			const aVal = a[sortBy]
			const bVal = b[sortBy]
			if (sortBy === 'flighttime' || sortBy === 'ispublic') {
				/** Flighttimes are numbers */
				return Number(aVal) - Number(bVal)
			} else {
				/** Everything else is strings */
				if (typeof aVal === 'string' && typeof bVal === 'string') {
					aVal.toLowerCase()
					bVal.toLowerCase()
				}
				return aVal === bVal ? 0 : aVal < bVal ? -1 : 1
			}
		})

		/** If we need desc direction then just reverse array */
		if (sortDir === 'desc') {
			newArr.reverse()
		}

		return newArr
	}

	return {
		sortFlights,
		convertToMinutes,
		convertMinutesToTime,
		getAirportLatLng,
		copyToClipboard
	}
}

export default useUtils
