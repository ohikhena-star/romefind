/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
  	extend: {
  		colors: {
  			border: 'rgb(var(--border) / <alpha-value>)',
  			input: 'rgb(var(--input) / <alpha-value>)',
  			ring: 'rgb(var(--ring) / <alpha-value>)',
  			background: 'rgb(var(--background) / <alpha-value>)',
  			foreground: 'rgb(var(--foreground) / <alpha-value>)',
  			primary: {
  				DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
  				foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
  			},
  			secondary: {
  				DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
  				foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
  			},
  			destructive: {
  				DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
  				foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
  			},
  			muted: {
  				DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
  				foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
  			},
  			accent: {
  				DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
  				foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
  			},
  			popover: {
  				DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
  				foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
  			},
  			card: {
  				DEFAULT: 'rgb(var(--card) / <alpha-value>)',
  				foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
  			},
  			rome: {
  				'50': '#f0f9ff',
  				'100': '#e0f2fe',
  				'200': '#bae6fd',
  				'300': '#7dd3fc',
  				'400': '#38bdf8',
  				'500': '#0284c7',
  				'600': '#0369a1',
  				'700': '#075985',
  				'800': '#0c4a6e',
  				'900': '#082f49',
  				'950': '#041d2f'
  			},
  			surface: {
  				'50': '#fafaf9',
  				'100': '#f5f5f4',
  				'200': '#e7e5e4',
  				'300': '#d6d3d1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				'950': '#070d18'
  			},
  			burgundy: {
  				DEFAULT: '#702443',
  				50: '#fdf2f6',
  				100: '#fce7ef',
  				200: '#f8d0e0',
  				500: '#702443',
  				600: '#702443',
  				700: '#5c1d37',
  				800: '#49172c',
  				900: '#381222'
  			},
  			cream: {
  				DEFAULT: '#F5EFE6',
  				50: '#fdfbf7',
  				100: '#f9f5ee',
  				200: '#f5efe6',
  				300: '#ebe0cf',
  				400: '#decbb2'
  			},
  			ink: {
  				DEFAULT: '#242321',
  				50: '#f6f6f5',
  				100: '#e7e6e4',
  				200: '#d0cfcb',
  				600: '#4a4844',
  				700: '#3a3835',
  				800: '#2e2c2a',
  				900: '#242321'
  			},
  			'muted-green': {
  				DEFAULT: '#E7EBD9',
  				50: '#f6f8f1',
  				100: '#e7ebd9',
  				200: '#d5dcbf',
  				border: '#cbd3b3'
  			},
  			'soft-lilac': {
  				DEFAULT: '#E8D8F2',
  				50: '#f7f2fb',
  				100: '#e8d8f2',
  				200: '#d6bde6',
  				border: '#cbb0dc'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			display: [
  				'3.5rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em',
  					fontWeight: '700'
  				}
  			],
  			headline: [
  				'2.5rem',
  				{
  					lineHeight: '1.15',
  					letterSpacing: '-0.02em',
  					fontWeight: '700'
  				}
  			],
  			'title-lg': [
  				'1.75rem',
  				{
  					lineHeight: '1.25',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			title: [
  				'1.25rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '600'
  				}
  			],
  			'body-lg': [
  				'1.125rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			overline: [
  				'0.6875rem',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '0.05em',
  					fontWeight: '600'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'22': '5.5rem',
  			'26': '6.5rem',
  			'30': '7.5rem'
  		},
  		borderRadius: {
  			sm: '0.25rem',
  			DEFAULT: '0.375rem',
  			md: '0.5rem',
  			lg: '0.75rem',
  			xl: '1rem'
  		},
  		boxShadow: {
  			card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  			'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  			elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -6px rgba(0, 0, 0, 0.05)',
  			modal: '0 20px 50px -12px rgba(0, 0, 0, 0.2)'
  		},
  		maxWidth: {
  			content: '1320px',
  			narrow: '720px',
  			wide: '1440px'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.3s ease-out',
  			'slide-up': 'slideUp 0.3s ease-out',
  			'slide-down': 'slideDown 0.3s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideDown: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [],
};
