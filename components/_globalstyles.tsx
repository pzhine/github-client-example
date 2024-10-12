import { ThemeType } from '@/styled'
import styled, { createGlobalStyle } from 'styled-components'

export const lightTheme = {
  colors: {
    text: '#111',
    background: '#fff',
    error: '#f04532',
    loading: '#bd60b8',
  },
}

export const darkTheme: ThemeType = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    text: '#fff',
    background: '#333',
  },
}

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    padding: 10px 24px;
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
