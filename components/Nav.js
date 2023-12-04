import { useRef, useState } from "react";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX} from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
import styles from "styles/components/nav.module.css"
import Image from 'next/image'

export default function Nav(pageprops){
  const [navIsOpen, setNavIsOpen] = useState(false);
  
  function handleOnClick(){
    setNavIsOpen(!navIsOpen);
  }

  const links = [
    {href: "/", text: "Home"},
    {href: "/admin", text: "Admin Panel", permissions: 1},
    {href: "/match", text: "Match", permissions: 1},
    {href: "/players", text: "Players"},
    {href: "/about", text: "About The Club"},
  ]
  
  return (
    <nav className={styles.nav} nav-state={navIsOpen ? "open" : "closed"}>
      <div className={styles.menuRight}>
        <button className={styles.navbutton} onClick={handleOnClick}>
          {navIsOpen ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
        <Link href="/" className={styles.mainlink}>
          <Image src="/CATTlogo.png" width={50} height={50} className={styles.logo} />
          <div>Caravel Academy Table Tennis</div>
        </Link>
      </div>
      <div className={styles.navcontainer}>
        <ul className={styles.navlist} aria-hidden={!navIsOpen}>
          {links.map(({href, text, permissions}, i) => {
            if(permissions){
              if(pageprops.user && pageprops.user.permissions >= permissions){
                return <NavLink linkhref={href} handleClick={handleOnClick} key={i}>{text}</NavLink>
              }
            } else {
              return <NavLink linkhref={href} handleClick={handleOnClick} key={i}>{text}</NavLink>
            }
          })}
        </ul>
      </div>
    </nav>
  )
}

function NavLink(props){
  const router = useRouter();
  return (
    <li className="button" is-active={router.pathname === props.linkhref ? "true" : "false"}>
      <Link className={styles.navlink} onClick={props.handleClick} href={props.linkhref}>{props.children}</Link>
    </li>
  );
}