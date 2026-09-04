const twtype = require('@tailwindcss/typography');
const twforms = require('@tailwindcss/forms');

module.exports = {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    container: {
			center: true,
			padding: {
				DEFAULT: '.8rem',
				sm: '1.5rem'
			  },
			screens: {
				sm: "100%",
				md: "100%",
				lg: "1140px",
				xl: "1380px",
				"2xl": "1540px"
			}
		},
    extend: {
		backgroundImage: theme => ({
			'home-cover': "url('/assets/images/mast/irs-building.jpg')",
		}),
		maxWidth: {
			xxs: '200px',
		},
		fontFamily: {
			display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
		},
      	colors: {
			brand: {
				light: '#e8e8e9',
				bright: '#bcb4ff',
				DEFAULT: '#2d2b3d',
				dark: '#201e2b',
				darker: '#121118',
				border: '#494754',
			},
			subtle: {
					DEFAULT: '#f6f6f6',
					dark: '#f1f1f1'
				},
			accent: {
				DEFAULT: '#d10000',
				dark: '#a80000',
			},
		},
    },
  },

  plugins: [ twtype, twforms ]
}