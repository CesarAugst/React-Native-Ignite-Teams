import styled, { css } from "styled-components/native"; 

export const Container = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_600};
  `}
  flex: 1;
  padding: 24px;
`; 