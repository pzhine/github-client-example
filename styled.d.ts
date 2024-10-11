import 'styled-components'
import { lightTheme } from './components/_globalstyles'

export type ThemeType = typeof lightTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
