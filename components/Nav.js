import { useRef, useState } from "react";
import { useRouter } from 'next/router'

import styles from "styles/components/nav.module.css"

export default function Nav(){
  const [navIsOpen, setNavIsOpen] = useState(false);
  const router = useRouter();

  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }

  return (
    <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
      <div className={styles.navcontainer}>
      <button className={styles.navbutton} onClick={handleOnClick}>{navIsOpen ? "Close" : "Menu"}</button>
      <ul className={styles.navlist} aria-hidden={!navIsOpen} >
        <li className="button" is-active={router.pathname === "/" ? "true" : "false"}><a href="/">Home</a></li>
        <li className="button" is-active={router.pathname === "/match" ? "true" : "false"}><a href="/match">Match</a></li>
        <li className="button" is-active={router.pathname === "/players" ? "true" : "false"}><a href="/players">Players</a></li>
        <li className="button" is-active={router.pathname === "/about" ? "true" : "false"}><a href="/about">About</a></li>
      </ul>
      </div>
    </nav>
  )
}