import styled from 'styled-components'
import { Themes } from './_globalstyles'

export const ThemeButton = styled(
  ({
    className,
    themeName,
    onClick,
  }: {
    className?: string
    themeName: Themes
    onClick: () => void
  }) => (
    <button className={className} onClick={onClick}>
      {themeName === 'dark' ? '☀️' : '🌙'}
    </button>
  )
)`
  & {
    border: none;
    background: transparent;
    font-size: 28px;
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme.colors.background2};
    }
  }
`
