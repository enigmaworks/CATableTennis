import { useRef, useState } from "react";
import styles from "styles/components/nav.module.css"

export default function Nav(){
  const [navIsOpen, setNavIsOpen] = useState(false);

  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }

  return (
    <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
      <div className={styles.navcontainer}>
      <button className={styles.navbutton} onClick={handleOnClick}>{navIsOpen ? "Close" : "Menu"}</button>
        <ul className={styles.navlist} aria-hidden={!navIsOpen} >
          <li className="button"><a href="/">Home</a></li>
          <li className="button"><a href="/match">Match</a></li>
          <li className="button"><a href="/players">Players</a></li>
          <li className="button"><a href="/about">About</a></li>
        </ul>
      </div>
    </nav>
  )
}