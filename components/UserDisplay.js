import Link from "next/link";
import styles from "styles/components/nav.module.css"

export default function UserDisplay(pageprops){
  return (
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
  )
}

function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}