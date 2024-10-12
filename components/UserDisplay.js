import Link from "next/link";
import Router from "next/router";
import styles from "/styles/components/userDisplay.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

export default function UserDisplay(pageprops){
  if(pageprops.signedin){
    return (
      <div className={styles.container}>
        <Link href="/profile">
            <FontAwesomeIcon icon={faUserCircle} className={styles.profileIcon}/>
            <div className={styles.username}>{pageprops.user.firstname} {pageprops.user.lastname}</div>
        </Link>
        <button className="fitcontentwidth light small" onClick={signout}>Sign Out</button>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <button className="fitcontentwidth light small" onClick={()=>{Router.push("/login")}}>Sign In</button>
      </div>
    );
  }
}

function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}