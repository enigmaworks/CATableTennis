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
            <div className={styles.username}>{pageprops.user.info_first_name} {pageprops.user.info_last_name}</div>
            <FontAwesomeIcon icon={faUserCircle} className={styles.profileIcon}/>
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