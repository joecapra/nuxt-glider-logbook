// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	css: ['@/assets/css/main.css', '@fortawesome/fontawesome-svg-core/styles.css'],
	imports: {
		dirs: ['stores']
	},
	build: {
		transpile: ['gsap']
	},
	vite: {
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					defaults: true,
					drop_console: true // <-- This is what you want
				},
				output: {
					comments: false
				}
			}
		}
	},
	modules: [
		[
			'@pinia/nuxt',
			{
				autoImports: ['defineStore', 'acceptHMRUpdate']
			}
		],
		'@vueuse/nuxt'
	],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {}
		}
	},
	runtimeConfig: {
		airlabsApiKey: process.env.AIRLABS_API_KEY,
		public: {
			netlifyUrl: process.env.NETLIFY_URL,
			firebaseApiKey: process.env.FIREBASE_API_KEY,
			staticMapsApiKey: process.env.STATICMAPS_API_KEY,
			baseUrl: process.env.NODE_ENV === 'production' ? process.env.NETLIFY_URL : 'http://localhost:3000',
			apiUrl: process.env.NODE_ENV === 'production' ? `${process.env.NETLIFY_URL}/api` : 'http://localhost:3000/api'
		}
	},
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/site.webmanifest' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@200;400' }
			]
		}
	}
})
