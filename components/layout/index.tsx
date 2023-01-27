import React from "react";
import styled from "@emotion/styled";
import Sidebar from "../sidebar";
import { Text } from "@geist-ui/core";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
`;

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <Wrapper>
      <Sidebar />
      <div style={{ flex: 1 }}>{children}</div>
    </Wrapper>
  );
};

export default Layout;
