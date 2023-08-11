import { ThemeProvider } from "styled-components"; // Provedor de temas
import { defaultTheme } from "./styles/themes/default"; // O tema em sí
import { GlobalStyle } from "./styles/global";
import { BrowserRouter } from 'react-router-dom'; // Context provider, deve envolver todos os outros componentes
import { Router } from "./Router"; // Componente de rotas

export function App() {
  return (
    // componente de temas
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <GlobalStyle />
    </ThemeProvider>
  )
}
