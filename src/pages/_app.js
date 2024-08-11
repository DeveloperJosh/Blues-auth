import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#01a0e9" />
        <meta
          name="description"
          content="Blue's Auth, a simple and easy to use authentication system for Next.js"
        />
        <meta property="og:title" content="Blue's Auth" />
        <meta
          property="og:description"
          content="Blue's Auth, a simple and easy to use authentication system for Next.js"
        />
        <meta property="og:image" content="/path-to-your-og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <title>Blue's Auth</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
