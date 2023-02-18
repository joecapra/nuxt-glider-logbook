<template>
	<Disclosure as="nav" class="bg-slate-800 w-full" v-slot="{ open, close }" static>
		<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
			<div class="relative flex h-16 items-center justify-between">
				<div v-if="user.userId" class="absolute inset-y-0 right-0 flex items-center sm:hidden">
					<!-- Mobile menu button-->
					<DisclosureButton
						v-if="!open"
						class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					>
						<Bars3Icon class="block h-6 w-6" aria-hidden="true" />
					</DisclosureButton>
					<DisclosureButton
						v-else
						class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						@click="close()"
					>
						<XMarkIcon class="block h-6 w-6" aria-hidden="true" />
					</DisclosureButton>
				</div>
				<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
					<div class="relative flex flex-shrink-0 items-center cursor-pointer" @click="navigateTo(user.userId ? '/dashboard' : '/auth')">
						<img class="block h-8 w-auto lg:hidden" src="/images/glider.svg" alt="LOGBOOK" />
						<img class="hidden h-8 w-auto lg:block" src="/images/glider.svg" alt="LOGBOOK" />
						<div class="thenav__sitetitle">LOG<span>BOOK</span></div>
					</div>
				</div>
				<div v-if="user.userId" class="hidden absolute inset-y-0 right-0 sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
					<!-- Profile dropdown -->
					<div class="text-white">{{ fullName }}</div>
					<Menu as="div" class="relative ml-3" v-slot="{ close }">
						<div>
							<MenuButton
								class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
							>
								<span class="sr-only">Open user menu</span>
								<img class="h-8 w-8 rounded-full object-cover" :src="profilePic" width="32" height="32" />
							</MenuButton>
						</div>
						<transition
							enter-active-class="transition ease-out duration-100"
							enter-from-class="transform opacity-0 scale-95"
							enter-to-class="transform opacity-100 scale-100"
							leave-active-class="transition ease-in duration-75"
							leave-from-class="transform opacity-100 scale-100"
							leave-to-class="transform opacity-0 scale-95"
						>
							<MenuItems
								class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							>
								<MenuItem v-slot="{ active }" @click="close()">
									<NuxtLink to="/dashboard">
										<div class="w-full flex items-center" :class="[active ? 'thenav__menu-btn--inactive' : '', 'thenav__menu-btn--active']">
											<font-awesome-icon icon="fa-solid fa-house" class="pr-2" />
											<div>Dashboard</div>
										</div>
									</NuxtLink>
								</MenuItem>
								<MenuItem v-slot="{ active }" @click="close()">
									<NuxtLink to="/profile">
										<div class="w-full flex items-center" :class="[active ? 'thenav__menu-btn--inactive' : '', 'thenav__menu-btn--active']">
											<font-awesome-icon icon="fa-solid fa-user" class="pr-2" />
											<div>Profile</div>
										</div>
									</NuxtLink>
								</MenuItem>
								<MenuItem v-slot="{ active }" @click="close()">
									<NuxtLink to="/settings">
										<div class="w-full flex items-center" :class="[active ? 'thenav__menu-btn--inactive' : '', 'thenav__menu-btn--active']">
											<font-awesome-icon icon="fa-solid fa-gear" class="pr-2" />
											<div>Settings</div>
										</div>
									</NuxtLink>
								</MenuItem>
								<MenuItem
									v-slot="{ active }"
									@click="
										() => {
											close()
											handleLogout()
										}
									"
								>
									<div class="w-full flex items-center" :class="[active ? 'thenav__menu-btn--inactive' : '', 'thenav__menu-btn--active']">
										<font-awesome-icon icon="fa-solid fa-solid fa-right-from-bracket" class="pr-2" />
										<div>Logout</div>
									</div>
								</MenuItem>
							</MenuItems>
						</transition>
					</Menu>
				</div>
			</div>
		</div>
		<!-- Mobile menu -->
		<DisclosurePanel class="sm:hidden" v-slot="{ close }">
			<OnClickOutside @trigger="close()">
				<div class="space-y-1 px-2 pt-2 pb-3">
					<div class="thenav__menu-mobile-divider" />
					<DisclosureButton class="thenav__menu-mobile-btn" @click="close()">
						<NuxtLink to="/dashboard">
							<div class="flex items-center gap-2">
								<font-awesome-icon icon="fa-solid fa-house" class="pl-2" />
								<div>Dashboard</div>
							</div>
						</NuxtLink>
					</DisclosureButton>
					<div class="thenav__menu-mobile-divider" />
					<DisclosureButton class="thenav__menu-mobile-btn" @click="close()">
						<NuxtLink to="/profile">
							<div class="flex items-center gap-2">
								<font-awesome-icon icon="fa-solid fa-user" class="pl-2" />
								<div>Profile</div>
							</div>
						</NuxtLink>
					</DisclosureButton>
					<div class="thenav__menu-mobile-divider" />
					<DisclosureButton class="thenav__menu-mobile-btn" @click="close()">
						<NuxtLink to="/settings">
							<div class="flex items-center gap-2">
								<font-awesome-icon icon="fa-solid fa-gear" class="pl-2" />
								<div>Settings</div>
							</div>
						</NuxtLink>
					</DisclosureButton>
					<div class="thenav__menu-mobile-divider" />
					<DisclosureButton class="thenav__menu-mobile-btn" @click="close()">
						<div @click="handleLogout" class="flex items-center gap-2">
							<font-awesome-icon icon="fa-solid fa-right-from-bracket" class="pl-2" />
							<div>Logout</div>
						</div>
					</DisclosureButton>
				</div>
			</OnClickOutside>
		</DisclosurePanel>
	</Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { OnClickOutside } from '@vueuse/components'

/**
 * Composables
 */
const firebaseAuth = useFirebaseAuth()
const router = useRouter()

/**
 * Store
 */
const firestoreStore = useFirestoreStore()
const { user } = storeToRefs(firestoreStore)

/**
 * Vars
 */

const fullName = computed(() => {
	return `${user.value.firstname} ${user.value.lastname}`
})
const profilePic = computed(() => {
	return user.value.profilepic
})

/**
 * Handlers
 */
const handleLogout = async (): Promise<void> => {
	const firestoreStore = useFirestoreStore()
	firestoreStore.clearStore()
	await firebaseAuth.logoutUser()
	router.replace('/auth')
}
</script>

<style scoped>
.thenav__menu-btn--inactive {
	@apply bg-slate-100  cursor-pointer;
}
.thenav__menu-btn--active {
	@apply px-2 py-2 text-sm text-gray-700 cursor-pointer;
}
.thenav__menu-mobile-divider {
	border-top: 1px solid;
	@apply border-slate-700;
}

.thenav__menu-mobile-btn {
	@apply w-full text-slate-300 hover:bg-slate-700 hover:text-white block px-2 py-2 rounded-md text-base font-medium;
}
.thenav__sitetitle {
	color: #c1c1c1;
	font-family: 'kanit';
	font-weight: 200;
	font-size: 2rem;
	margin-left: 0.5rem;
}

.thenav__sitetitle span {
	color: white;
	font-family: 'kanit';
	font-weight: 400;
	font-size: 2rem;
}
</style>
