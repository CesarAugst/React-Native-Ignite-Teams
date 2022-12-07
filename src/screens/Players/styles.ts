import styled, { css } from "styled-components/native"; 

export const Container = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_600};
  `}
  flex: 1;
  padding: 24px;
`; 

export const Form = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_700};
  `}  
  width: 100%;
  flex-direction: row;
  justify-content: center;
  border-radius: 6px;
`;