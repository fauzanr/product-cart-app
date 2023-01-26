import { Html, Head, Main, NextScript } from "next/document";
import { Global } from "@emotion/react";
import globalCss from "@/styles/globals";
import { CssBaseline } from "@geist-ui/core";

export default function Document() {
  const geistUICss = CssBaseline.flush();

  return (
    <Html lang="en">
      <Head>
        {geistUICss}
        <Global styles={globalCss} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
