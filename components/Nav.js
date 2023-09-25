import { useRef, useState } from "react";
import { useRouter } from 'next/router'

import styles from "styles/components/nav.module.css"

export default function Nav(pageprops){
  const [navIsOpen, setNavIsOpen] = useState(false);
  
  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }
  
  return (
    <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
      <div className={styles.navcontainer}>
      <button className={styles.navbutton} onClick={handleOnClick}>{navIsOpen ? "Close" : "Menu"}</button>
      <ul className={styles.navlist} aria-hidden={!navIsOpen} >
        <NavLink linkhref="/">Home</NavLink>
        <NavLink linkhref="/players">Players</NavLink>
        <NavLink linkhref="/match">Match</NavLink>
        <NavLink linkhref="/calendar">Calendar</NavLink>
        <NavLink linkhref="/about">About</NavLink>
      </ul>
      </div>
    </nav>
  )
}

function NavLink({linkhref, children}){
  const router = useRouter();
  return (
    <li className="button" is-active={router.pathname === linkhref ? "true" : "false"}>
      <a href={linkhref}>{children}</a>
    </li>
  );
}