import Head from 'next/head'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { ThemeButton } from './ThemeButton'
import { Themes } from './_globalstyles'

export const Layout = styled(
  ({
    children,
    className,
    themeName,
    onToggleTheme,
  }: {
    children: ReactNode
    className?: string
    themeName: Themes
    onToggleTheme: () => void
  }) => {
    return (
      <div className={className}>
        <Head>
          <title>GitHub Issue Browser</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <nav>
          <h1>GitHub Issue Browser</h1>
          <ThemeButton themeName={themeName} onClick={onToggleTheme} />
        </nav>
        <main>{children}</main>
      </div>
    )
  }
)`
  & nav {
    display: flex;
    border-bottom: 1px solid ${(props) => props.theme.colors.text2};
    margin-bottom: 8px;
    padding: 3px 12px;
    justify-content: space-between;

    & h1 {
      font-size: 16px;
      line-height: 16px;
    }
  }
  & div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  & main {
    padding: 10px 24px;
  }
`
