import { css } from "@emotion/react";

export default css`
  @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap");
  :root {
    --txtBlack: #04111d;
    --txtPrimary: #04111dbf;
  }
  * {
    font-family: Rubik, sans-serif;
    box-sizing: border-box;
  }
  html,
  body {
    padding: 0;
    margin: 0;

    max-width: 100vw;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--txtBlack);
    margin: 0;
  }
  p,
  span,
  label {
    color: var(--txtPrimary);
    margin: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  @media only screen and (max-width: 576px) {
    body {
      font-size: 0.8em;
    }
  }
  @media (prefers-color-scheme: dark) {
    body {
      color: black !important;
      background: white !important;
    }
  }
`;
