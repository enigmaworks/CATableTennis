import "/styles/globals.css";
import Nav from "../components/Nav";

export default function App({ Component, pageProps }) {
  return( <>
    <Nav></Nav>
    <main>
      <Component {...pageProps} />
    </main>
  </>)
}
