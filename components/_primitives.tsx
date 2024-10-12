import styled from 'styled-components'
import { lightTheme } from './_globalstyles'

export const Container = styled.div<{
  $bg?: keyof typeof lightTheme.colors
}>`
  padding: 8px;
  background: ${(props) =>
    props.$bg ? props.theme.colors[props.$bg] : 'transparent'};
  color: ${(props) => props.theme.colors.text};
`
