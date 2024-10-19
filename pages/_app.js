import "/styles/globals.css";
import Nav from "/components/Nav";
import UserDisplay from "/components/UserDisplay";
import useTheme from "/helpers/useTheme";

export default function App({ Component, pageProps }) {
  useTheme();

  return( <>
    <style>
      {'body:not(.body-visible){visibility: hidden;}'}
    </style>
    <Nav {...pageProps}></Nav>
    <UserDisplay {...pageProps} ></UserDisplay>
    <main>
      <Component {...pageProps} />
    </main>
  </>)
}
