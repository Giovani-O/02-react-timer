import { ThemeProvider } from "styled-components"; // Provedor de temas
import { Button } from "./components/Button";
import { defaultTheme } from "./styles/themes/default"; // O tema em sí

export function App() {
  return (
    // componente de temas
    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary" />
      <Button variant="secondary" />
      <Button variant="success" />
      <Button variant="danger" />
      <Button />
    </ThemeProvider>
  )
}
