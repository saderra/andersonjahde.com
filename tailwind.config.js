const theme = require('tailwindcss/defaultTheme');
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
			'home-cover': "url('/assets/images/home.jpg')"
		}),
		fontWeight: {
			light: 200,
			normal: 300,
			medium: 400,
			strong: 500,
			stronger: 600
		},
		maxWidth: {
			xxs: '200px',
		},		
		fontSize: { 
			"toptext": ".8rem",
			"sbtext": ".6rem"
		},
      	colors: {
			ajblue: {
				DEFAULT: '#1b2023'
			}
		},
    },
  },

  variants: {
		display: ['responsive', 'group-hover', 'group-focus'],
	},
  plugins: [ twtype, twforms ]
}