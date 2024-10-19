import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/match.module.css";
import toast, { Toaster } from 'react-hot-toast';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user && user.permissions >= 1){
      return {props: { signedin: true, user: user, session: req.session}}
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
  if((query.win1_id === undefined || query.lose1_id === undefined) && ((query.win2_id !== undefined && query.lose2_id !== undefined) || (query.win2_id === undefined && query.lose2_id === undefined))){
    useEffect(()=>{
      Router.push("/match");
    },[])
    return (<></>);
  }

  function userObj(id, firstname, lastname, w, l){
    return {id: id, info_first_name: firstname, info_last_name: lastname, stats_w: w, stats_l: l};
  }

  let winners = [userObj(query.win1_id, query.win1_first, query.win1_last, query.win1_w, query.win1_l)];
  let losers = [userObj(query.lose1_id, query.lose1_first, query.lose1_last, query.lose1_w, query.lose1_l)];

  if(query.numplayers === "4"){
    winners.push(userObj(query.win2_id, query.win2_first, query.win2_last, query.win2_w, query.win2_l));
    losers.push(userObj(query.lose2_id, query.lose2_first, query.lose2_last, query.lose2_w, query.lose2_l));
  }

  let [winningTeam, setWinningTeam] = useState(winners);
  let [losingTeam, setLosingTeam] = useState(losers);
  

  function swapTeams(){
    setWinningTeam(losingTeam);
    setLosingTeam(winningTeam);
  }

  async function saveResult(){

    const [res1, res2] = await Promise.all([
      fetch("/api/users/edit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        session: props.session,
        body: JSON.stringify({
          id: winningTeam[0].id,
          data: {stats_w: parseInt(winningTeam[0].stats_w) + 1}
        })
      }),
      fetch("/api/users/edit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        session: props.session,
        body: JSON.stringify({
          id: losingTeam[0].id,
          data: {stats_l: parseInt(winningTeam[0].stats_l) + 1}
        })
      })
    ]);

    let res3 = {status: 200}; 
    let res4 = {status: 200};

    if(winningTeam[1] !== undefined && losingTeam[1] !== undefined){
      [res3, res4] = await Promise.all([
        fetch("/api/users/edit", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          session: props.session,
          body: JSON.stringify({
            id: winningTeam[1].id,
            data: {stats_w: parseInt(winningTeam[1].stats_w) + 1}
          })
        }),
        fetch("/api/users/edit", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          session: props.session,
          body: JSON.stringify({
            id: losingTeam[1].id,
            data: {stats_l: parseInt(winningTeam[1].stats_l) + 1}
          })
        })
      ])
    }

    if(res1.status === 200 && res2.status === 200 && res3.status === 200 && res4.status === 200){
      Router.push("/match");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    
  }

  return(
  <>
    <header>
      <h1>Confirm Match Results</h1>
    </header>
    <Toaster position="bottom-center" reverseOrder={false}/>
    <section className="centercontent">
      <div className={styles.saveScreenContainer}>
        <div>
          {winningTeam[0].info_first_name} {winningTeam[0].info_last_name}
          {query.numplayers === "4" ? ` & ${winningTeam[1].info_first_name} ${winningTeam[1].info_last_name}`: ""}
        </div>
        <div className={styles.saveScreenCompareText}>defeated</div>
        <div>
          {losingTeam[0].info_first_name} {losingTeam[0].info_last_name}
          {query.numplayers === "4" ? ` & ${losingTeam[1].info_first_name} ${losingTeam[1].info_last_name}`: ""}
        </div>
      </div>
      <button className="important" onClick={saveResult}>Confirm</button>
      <button onClick={swapTeams}>Swap</button>
    </section>
  
  </>);
}