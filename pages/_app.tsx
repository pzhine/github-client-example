import { ApolloProvider } from '@apollo/client'
import client from '../lib/apolloClient'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle, Themes, themes } from '@/components/_globalstyles'
import { Layout } from '@/components/Layout'
import { useCallback, useEffect, useState } from 'react'

function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<Themes>('dark')
  useEffect(() => {
    const localTheme = localStorage.getItem('theme') ?? 'dark'
    setTheme(localTheme as Themes)
  }, [])
  const onToggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }, [theme])
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      <ApolloProvider client={client}>
        <Layout themeName={theme} onToggleTheme={onToggleTheme}>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </ThemeProvider>
  )
}

export default App
