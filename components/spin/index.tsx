import styled from "@emotion/styled";
import { Loading } from "@geist-ui/core";
import React, { ReactNode } from "react";

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  opacity: 0.5;
  pointer-events: none;
`;

const Spin = ({
  loading,
  children,
}: {
  loading?: boolean;
  children: ReactNode;
}) => {
  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <LoadingOverlay>
          <Loading type="success" />
        </LoadingOverlay>
      )}
      {children}
    </div>
  );
};

export default Spin;
