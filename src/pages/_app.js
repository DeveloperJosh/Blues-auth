import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Blue's Auth</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
