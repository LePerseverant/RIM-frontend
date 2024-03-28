import { createTheme, ThemeOptions } from '@mui/material/styles';
import whitrabt from "../assets/whitrabt.woff"

let theme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: '#fff',
      light: "#ebebeb",
      dark: "#141414",
      contrastText: "linear-gradient(to right, #a8a9ad, #e3e3e3)"
    }
  },
  typography: {
    fontFamily: "whitrabt"
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: "whitrabt";
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local("whitrabt"),  url(${whitrabt}) format('woff');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `
    }
  }
}

theme = createTheme(theme)

export default theme
