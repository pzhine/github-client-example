import { ApolloProvider } from '@apollo/client'
import client from '../lib/apolloClient'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import {
  darkTheme,
  GlobalStyle,
  lightTheme,
} from '@/components/_globalstyles'
import { Layout } from '@/components/Layout'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </ThemeProvider>
  )
}

export default App
