
let scale = [8]
for (var i = 0; i < 18; i++) {
  scale[i + 1] = scale[i] + (parseInt((i - 2) / 4) + 1) * 2
}
// get rid of 8 and 10px font sizes
scale.splice(0, 2)
const scaleRem = scale.map(t => t / 16 + "rem")

colorScheme = {
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
}

const headingTextStandards = {
  fontFamily: "heading",
  fontWeight: "heading",
  lineHeight: "heading",
}

const bodyTextStandards = {
  fontFamily: "body",
  fontWeight: "body",
  lineHeight: "body",
}


export default {
  useColorSchemeMediaQuery: true,
  breakpoints: ["576px", "768px", "992px", "1200px", "1360px", "1600px"],
  colors: {
    text: colorScheme.gray[900],
    background: colorScheme.gray[100],
    primary: colorScheme.purple[450],
    secondary: '',
    ...colorScheme,
    modes: {
      dark: {
        text: colorScheme.gray[100],
        background: colorScheme.gray[900],
        primary: colorScheme.purple[900],
        secondary: '',
      }
    }
  },
  fonts: {
    heading: "Georgia, \"Times New Roman\", Times, serif",
    body: "Montserrat, \"Helvetica Neue\", Arial, sans-serif",
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    solid: 1,
    dense: 1.25,
    heading: 1.25,
    default: 1.5,
    body: 1.5,
    loose: 1.75,
  },
  fontSizes: scaleRem,
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72],
  styles: {
    root: {
      boxSizing: "border-box",
      fontFamily: "body",
      color: "text.body",
      backgroundColor: "background.primary",
      "*": {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
      },
    },
    h1: {
      variant: "text.heading",
      fontSize: [7, null, null, 9],
    },
    h2: {
      fontSize: 5,
      lineHeight: [1.22, 1.18, 1.02],
      variant: "text.heading",
    },
    h3: {
      fontSize: 4,
      lineHeight: [1.22, 1.18, 1.23],
      variant: "text.heading",
    },
    h4: {
      fontSize: 3,
      lineHeight: [1.25, 1.43, 1.16],
      variant: "text.heading",
    },
    h5: {
      fontSize: 2,
      lineHeight: [1.35, 1.43, 1.36],
      variant: "text.heading",
    },
    h6: {
      fontSize: 1,
      lineHeight: [1.35, 1.43, 1.36],
      variant: "text.heading",
    },
    p: {
      fontSize: 2,
      lineHeight: [1.59],
      ...bodyTextStandards,
    },
    a: {
      variant: "text.link",
    },
  },
  sizes: {
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    // eslint-disable-next-line quote-props
    "1": "100%",
    screen: "100vw",
  },
}
