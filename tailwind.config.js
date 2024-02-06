/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					100: '#fc9a85',
					300: '#fb795c',
					500: '#FA5733',
					900: '#96341f'
				},
				background: {
					500: '#F8F7F4'
				},
				card: {
					500: '#FFFFFF'
				}
			}
		}
	},
	plugins: []
};
