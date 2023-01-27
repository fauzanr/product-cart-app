import React from "react";
import styled from "@emotion/styled";
import Sidebar from "../sidebar";
import { Text } from "@geist-ui/core";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
`;

const Main = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <Wrapper>
      <Sidebar />
      <Main>{children}</Main>
    </Wrapper>
  );
};

export default Layout;
