/** *******************************************************************************
 * Setup Yup Schemas
 * ***************************************************************************** */

import * as yup from 'yup'

const useYupSchema = () => {
	const validationErrors = {
		int: 'Must be a whole number',
		num: 'You must enter a number'
	}

	const flightSchema = yup.object({
		date: yup.string().required(),
		aircraft: yup.string().required(),
		tailnumber: yup.string().required(),
		departure: yup.string().required(),
		arrival: yup.string().required(),
		hours: yup.number().required().integer(validationErrors.int).min(0).max(59).typeError(validationErrors.num),
		min: yup.number().required().integer(validationErrors.int).min(0).max(59).typeError(validationErrors.num),
		releasealt: yup.number().required().integer(validationErrors.int).min(0).typeError(validationErrors.num),
		maxalt: yup.number().required().integer(validationErrors.int).min(0).typeError(validationErrors.num),
		comments: yup.string()
	})

	const addAircraftSchema = yup.object({
		aircrafttype: yup.string().required(),
		tailnumber: yup.string().required()
	})

	const addAirportSchema = yup.object({
		icaocode: yup.string().required()
	})

	return {
		flightSchema,
		addAircraftSchema,
		addAirportSchema
	}
}

export default useYupSchema
