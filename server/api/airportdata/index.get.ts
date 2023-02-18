/** Get airport data from airlabs */
export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()
	const { icaocode } = getQuery(event)

	const url = `https://airlabs.co/api/v9/airports?iata_code=${icaocode}&api_key=${runtimeConfig.airlabsApiKey}`
	const data: any = await $fetch(url)

	return data.response
})
