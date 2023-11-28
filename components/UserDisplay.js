import Link from "next/link";
import styles from "styles/components/userDisplay.module.css"

export default function UserDisplay(pageprops){
  
}

function signout(){
  fetch("./api/logout").then(()=>{
    location.reload(true);
  })
}