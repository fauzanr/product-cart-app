import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import WindowProvider from "@/contexts/WindowProvider";
import { SWRConfig } from "swr";
import { GeistProvider } from "@geist-ui/core";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 0,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <GeistProvider>
        <WindowProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WindowProvider>
      </GeistProvider>
    </SWRConfig>
  );
}
