import Link from "next/link";
import Router from "next/router";
import styles from "styles/components/userDisplay.module.css"

export default function UserDisplay(pageprops){
  if(pageprops.signedin){
    return (
      <div className={styles.container}>
        <Link href="/profile" className={styles.profile}>{pageprops.user.firstname} {pageprops.user.lastname}</Link>
        <button className="fitcontentwidth light" onClick={signout}>Sign Out</button>
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