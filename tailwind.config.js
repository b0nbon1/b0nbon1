module.exports = {
  theme: {
      container: {
          padding: '1rem'
      },

      extend: {
        borderRadius: {
            'xl': '70px',
        },
        borderWidth: {
            '14': '14px',
        },
        screens:{
            'dark': {'raw':'(prefers-color-scheme: dark)'}
        },
        minHeight: {
            '1': '25vh',
            '2': '50vh',
            '3': '72vh',
            'sm': '15vh',
            '72': '24rem',
        },
        maxHeight: {
            '1': '25vh',
            '2': '50vh',
            '3': '72vh',
            'sm': '15vh',
        },
        height: {
        'xs': '25vh',
        'md': '50vh',
        'xl': '57vh',
        'lg': '75vh',
        'sm': '15vh',
        '72': '24rem',
        },
      },

      colors: {
          transparent: 'transparent',

          black: '#000',
          white: '#fff',
          purple: {
              50: '#fcfaff',
              100: '#f6edfa',
              200: '#f1defa',
              300: '#d9bae8',
              400: '#b17acc',
              450: '#7510F7',
              500: '#8a4baf',
              600: '#663399',
              700: '#542c85',
              800: '#452475',
              900: '#362066'
          },
          orange: {
              50: '#fffcf7',
              100: '#fff4db',
              200: '#ffedbf',
              300: '#ffe4a1',
              400: '#ffd280',
              500: '#ffb238',
              600: '#fb8400',
              700: '#f67300',
              800: '#e65800',
              900: '#db3a00'
          },

          magenta: {
              50: '#fffafd',
              100: '#ffe6f6',
              200: '#f2c4e3',
              300: '#e899ce',
              400: '#d459ab',
              500: '#bc027f',
              600: '#a6026a',
              700: '#940159',
              800: '#7d0e59',
              900: '#690147'
          },

          blue: {
              50: '#f5fcff',
              100: '#dbf0ff',
              200: '#90cdf9',
              300: '#63b8f6',
              400: '#3fa9f5',
              500: '#0d96f2',
              600: '#0e8de6',
              700: '#047bd3',
              800: '#006ac1',
              900: '#004ca3'
          },

          teal: {
              50: '#f7ffff',
              100: '#dcfffd',
              200: '#ccfffc',
              300: '#a6fffa',
              400: '#73fff7',
              500: '#05f7f4',
              600: '#2de3da',
              700: '#00bdb6',
              800: '#10a39e',
              900: '#008577'
          },

          yellow: {
              50: '#fffdf7',
              100: '#fff5bf',
              200: '#fff2a8',
              300: '#ffeb99',
              400: '#ffdf37',
              500: '#fed038',
              600: '#fec21e',
              700: '#e3a617',
              800: '#bf9141',
              900: '#8a6534'
          },

          red: {
              50: '#fffafa',
              100: '#fde7e7',
              200: '#ffbab8',
              300: '#ff8885',
              400: '#ff5a54',
              500: '#fa2915',
              600: '#ec1818',
              700: '#da0013',
              800: '#ce0009',
              900: '#b80000'
          },

          green: {
              50: '#f7fdf7',
              100: '#def5dc',
              200: '#a1da9e',
              300: '#79cd75',
              400: '#59c156',
              500: '#37b635',
              600: '#2ca72c',
              700: '#1d9520',
              800: '#088413',
              900: '#006500'
          },

          grey: {
              50: '#fbfbfb',
              100: '#f5f5f5',
              200: '#f0f0f2',
              300: '#d9d7e0',
              400: '#b7b5bd',
              500: '#78757a',
              600: '#635e69',
              700: '#48434f',
              800: '#36313d',
              900: '#232129'
          },

          gray: {
              100: '#f7fafc',
              200: '#edf2f7',
              300: '#e2e8f0',
              400: '#cbd5e0',
              500: '#a0aec0',
              600: '#718096',
              700: '#4a5568',
              800: '#2d3748',
              900: '#1a202c',
          },
      },
  },
  fontFamily: {
      sans: [
          'Roboto', 
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
      ],
      serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      ram: ['"Rammetto One"', 'cursive'],
      helvetica: ['Helvetica', 'Arial', 'sans-serif']
  },
  variants: {},
  plugins: [],
  fill: theme => theme('colors')
};
