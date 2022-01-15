const theme = {
  config: {
    initialColorModeName: "light",
  },
  colors: {
    modes: {
      dark: {
        text: "#cbd5e0",
        background: "#1A202C",
        primary: "#9f7aea",
        primaryHover: "#2c5282",
        secondary: "#7f8ea3",
        muted: "#2d3748",
        light: "#f7fafc",
        dark: "#2d3748",
        textMuted: "#718096",
        toggleIcon: "#cbd5e0",
        heading: "#fff",
        divide: "#2d3748",
      },
      light: {
        text: "#2d3748",
        background: "#fff",
        primary: "#6b46c1",
        primaryHover: "#2c5282",
        secondary: "#5f6c80",
        muted: "#e2e8f0",
        light: "#f7fafc",
        dark: "#2d3748",
        textMuted: "#718096",
        toggleIcon: "#2d3748",
        heading: "#000",
        divide: "#cbd5e0",
      },
    },
  },
  fonts: {
    body: 'monospace, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    heading: "Georgia, serif",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  letterSpacings: {
    body: "normal",
    caps: "0.2em",
  },
};

export default theme;
