// For Nuxt 3
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faTrashCan,
	faPlaneSlash,
	faCircleXmark,
	faChevronDown,
	faCalendarDays,
	faPlaneArrival,
	faPlaneDeparture,
	faFile,
	faFileExcel,
	faLock,
	faUnlock,
	faShareNodes,
	faLink,
	faUser,
	faGear,
	faRightFromBracket,
	faClock,
	faArrowUpWideShort,
	faArrowDownWideShort,
	faAnglesLeft,
	faPenToSquare,
	faPlaneUp,
	faArrowDownShortWide,
	faCheck,
	faHouse,
	faFileArrowDown
} from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark as farCircleXmark } from '@fortawesome/free-regular-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
	farCircleXmark,
	faTrashCan,
	faPlaneSlash,
	faCircleXmark,
	faChevronDown,
	faCalendarDays,
	faPlaneArrival,
	faPlaneDeparture,
	faFile,
	faFileExcel,
	faLock,
	faUnlock,
	faShareNodes,
	faLink,
	faUser,
	faGear,
	faRightFromBracket,
	faClock,
	faArrowUpWideShort,
	faArrowDownWideShort,
	faAnglesLeft,
	faPenToSquare,
	faPlaneUp,
	faArrowDownShortWide,
	faCheck,
	faHouse,
	faFileArrowDown
)
// library.add(far)

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
})
