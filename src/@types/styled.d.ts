import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Arquivo de definição de tipos, guarda os tipos de defaultTheme em ThemeType
type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  // DefaultTheme do styled-components se torna uma extensão de theme type
  export interface DefaultTheme extends ThemeType {}
}
