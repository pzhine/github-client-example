import { Container } from './_primitives'
import { ReactNode } from 'react'

export const Error = ({ children }: { children: ReactNode }) => (
  <Container $bg="error">{children}</Container>
)
