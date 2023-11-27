import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/match.module.css";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user && user.permissions === 1){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      return {props: { signedin: true, user: user, usersdata: data}}
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        }
      }
    }
  }
);

export default function SavePage(props){
  let {query} = useRouter();


  //check that both players for both teams are present 1v1 or full 2v2 teams
  if((query.win1 === undefined || query.lose1 === undefined) && ((query.win2 !== undefined && query.lose2 !== undefined) || (query.win2 === undefined && query.lose2 === undefined))){
    useEffect(()=>{
      Router.push("/match");
    },[])
    return (<></>);
  }

  let winningTeam = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.win1)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.win2))];
  let losingTeam = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.lose1)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.lose2))];


  return(
  <>
    <header>
      <h1>Confirm Match Results</h1>
    </header>
    <section className="centercontent">
      <div className={styles.saveScreenContainer}>
        <div>
          {winningTeam[0].info.firstname} {winningTeam[0].info.lastname}
          {winningTeam[1] !== undefined ? ` & ${winningTeam[1].info.firstname} ${winningTeam[1].info.lastname}`: ""}
        </div>
        <div className={styles.saveScreenCompareText}>over</div>
        <div>
          {losingTeam[0].info.firstname} {losingTeam[0].info.lastname}
          {losingTeam[1] !== undefined ? ` & ${losingTeam[1].info.firstname} ${losingTeam[1].info.lastname}`: ""}
        </div>
      </div>
      <button className="important">Confirm</button>
      <button>Swap</button>
    </section>
  
  </>);
}