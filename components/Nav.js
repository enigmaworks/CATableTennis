import { useRef, useState } from "react";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX} from '@fortawesome/free-solid-svg-icons'


import styles from "styles/components/nav.module.css"

export default function Nav(pageprops){
  const [navIsOpen, setNavIsOpen] = useState(false);
  
  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }
  
  return (
    <>
      <div className={styles.logosmall}>
        <img className={styles.logosmall} alt="Catt logo" src="/CATTLogo.png" />
      </div>
      <div className={styles.loginout}>
        {(pageprops.signedin) ? pageprops.user.username : ""}{" | "}
        {(pageprops.signedin) ? <a href="" onClick={signout}>Log Out</a>: <a href="/login">Log In</a>}
      </div>
      <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
        <div className={styles.navcontainer}>
          <button className={styles.navbutton} onClick={handleOnClick}>
            {navIsOpen ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faBars} />}
            {navIsOpen ? " Close" : " Menu"}
          </button>
          <ul className={styles.navlist} aria-hidden={!navIsOpen} >
            <NavLink linkhref="/">Home</NavLink>
            {(pageprops.signedin && pageprops.user.permissions === 1) ? <NavLink linkhref="/admin">Admin Page</NavLink> : ""}
            <NavLink linkhref="/players">Players</NavLink>
            <NavLink linkhref="/match">Match</NavLink>
            <NavLink linkhref="/calendar">Calendar</NavLink>
            <NavLink linkhref="/join">Join</NavLink>
          </ul>
        </div>
      </nav>
    </>
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


function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}