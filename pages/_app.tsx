import type { AppProps } from "next/app";
import Layout from "./components/layout";
import WindowProvider from "@/contexts/WindowProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WindowProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WindowProvider>
  );
}
