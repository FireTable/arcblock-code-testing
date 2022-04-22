import logo from './logo.svg';
import styled, { createGlobalStyle } from 'styled-components';

const Wrapper = styled.div``;

const GlobalStyle = createGlobalStyle`
  #root{
    height: 100vh;
  }
  
  // rightContent居中
  .ant-pro-right-content {
    display: flex;
    align-items: center;
  }
`;

export default function IndexPage() {
  return (
    <Wrapper>
      <GlobalStyle />
    </Wrapper>
  );
}
