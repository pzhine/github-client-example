import Head from 'next/head'
import { ReactNode } from 'react'
import styled from 'styled-components'

const _Layout = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={className}>
      <Head>
        <title>GitHub Issue Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>GitHub Issue Browser</h1>
      <main>{children}</main>
    </div>
  )
}

export const Layout = styled(_Layout)`
  div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`
