import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Blue&#39;s Auth</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
