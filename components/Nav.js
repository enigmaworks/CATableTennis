import { useRef, useState } from "react";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX} from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";


import styles from "styles/components/nav.module.css"

export default function Nav(pageprops){
  const [navIsOpen, setNavIsOpen] = useState(false);
  
  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }
  
  return (
    <>
      <div className={styles.loginout}>
        {(pageprops.signedin) ? <div>{pageprops.user.username}{" | "}</div> : ""}
        <div>
          <Link
            href={(pageprops.signedin) ? "/" : "/login"}
            onClick={(pageprops.signedin) ? signout: ()=>{}}
          >
            {(pageprops.signedin) ? "Log Out" : "Log In"}
          </Link>
        </div>
      </div>
      <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
        <div className={styles.navcontainer}>
          <button className={styles.navbutton} onClick={handleOnClick}>
            {navIsOpen ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faBars} />}
            {navIsOpen ? " Close" : " Menu"}
          </button>
          <ul className={styles.navlist} aria-hidden={!navIsOpen} >
            <NavLink linkhref="/" handleClick={handleOnClick}>Home</NavLink>
            {(pageprops.signedin && pageprops.user.permissions === 1) ? <>
              <NavLink linkhref="/admin" handleClick={handleOnClick}>Admin Page</NavLink>
              <NavLink linkhref="/match" handleClick={handleOnClick}>Match</NavLink>
            </>: ""}
            <NavLink linkhref="/players" handleClick={handleOnClick}>Players</NavLink>
            <NavLink linkhref="/calendar" handleClick={handleOnClick}>Calendar</NavLink>
            <NavLink linkhref="/join" handleClick={handleOnClick}>Join</NavLink>
          </ul>
        </div>
      </nav>
    </>
  )
}

function NavLink(props){
  const router = useRouter();
  return (
    <li className="button" is-active={router.pathname === props.linkhref ? "true" : "false"}>
      <Link onClick={props.handleClick} href={props.linkhref}>{props.children}</Link>
    </li>
  );
}


function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}