import { useRef, useState } from "react";
import styles from "styles/components/nav.module.css"

export default function Nav(){
  const [navIsOpen, setNavIsOpen] = useState(false);

  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }

  return (
  <nav className={navIsOpen ? styles.nav_open : styles.nav_closed}>
    <button className={styles.navbutton} onClick={handleOnClick}>{navIsOpen ? "Close" : "Menu"}</button>
    <a href="/login">Login</a>
    <ul aria-hidden={!navIsOpen}  className={styles.navlist}>
      <li><a href="/">Home</a></li>
      <li><a href="/match">Match</a></li>
      <li><a href="/players">Players</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
  )
}