import { ThemeType } from '@/styled'
import { createGlobalStyle } from 'styled-components'

const lightTheme = {
  sizes: {
    controlHeight: '2.2rem',
  },
  typeography: {
    medium: '15px',
    small: '12px',
  },
  colors: {
    text: '#111',
    text2: '#666',
    controlText: '#fff',
    background: '#fff',
    background2: '#ccc',
    error: '#f04532',
    loading: '#bd60b8',
    button: '#035efc',
    buttonDisabled: '#6784b5',
    buttonActive: '#003ca1',
    openStatus: '#00a60b',
    closedStatus: '#ab03a2',
  },
}

const darkTheme: ThemeType = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    text: '#fff',
    text2: '#aaa',
    background: '#222',
    background2: '#333',
  },
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}

export type Themes = keyof typeof themes

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    font-size: ${(props) => props.theme.typeography.medium};
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`
