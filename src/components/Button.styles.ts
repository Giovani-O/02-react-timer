import styled, { css } from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'; // tipos de variantes

// Interface
interface ButtonContainerProps {
  variant: ButtonVariant;
}

// Objeto com as variantes
const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green',
}

// Exporta o styled component interpolando a property para definir a cor
export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  background-color: ${props => props.theme["green-500"]};
  color: ${props => props.theme.white};
  border-radius: 4px;
  border: 0;
  margin: 8px;

  /* ${props => { 
      return css`
        background-color: ${buttonVariants[props.variant]}
      ` 
    }
  } */
`