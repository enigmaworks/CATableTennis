import "/styles/globals.css";
import Nav from "../components/Nav";
import UserDisplay from "components/UserDisplay";

export default function App({ Component, pageProps }) {
  return( <>
    <Nav {...pageProps}></Nav>
    <UserDisplay {...pageProps} ></UserDisplay>
    <main>
      <Component {...pageProps} />
    </main>
  </>)
}
