import type { AppProps } from "next/app";
import Layout from "./components/layout";
import WindowProvider from "@/contexts/WindowProvider";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <WindowProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WindowProvider>
    </SWRConfig>
  );
}
