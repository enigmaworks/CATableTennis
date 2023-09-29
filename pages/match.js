import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/match.module.css";
import { useRef, useState } from "react";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user && user.permissions === 1){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      return {props: { signedin: true, user: user, usersdata: data }}
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

export default function MatchPage(props){
  const [gamePhase, setgamePhase] = useState("setup");
  const [numPlayers, setNumPlayers] = useState(2);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const matchTypeSelect = useRef();
  const p1Select = useRef();
  const p2Select = useRef();
  const p3Select = useRef();
  const p4Select = useRef();

  function playerIsAvailable(id){
    for(let i = 0; i < props.usersdata.length; i++){
      if(team1.includes(id) || team2.includes(id)) return false;
      return true;
    }
  }
  function updateTeam(num){
    if(num===1){
      if(numPlayers===2){
        setTeam1([parseInt(p1Select.current.value)]);
      } else {
        setTeam1([parseInt(p1Select.current.value), parseInt(p2Select.current.value)]);
      }
    } else if(num===2){
      if(numPlayers===2){
        setTeam2([parseInt(p3Select.current.value)]);
      } else {
        setTeam2([parseInt(p3Select.current.value), parseInt(p4Select.current.value)]);
      }
    }
  }

  return (
  <>
    <Head>
      <title>Match | Caravel Table Tennis </title>
    </Head>
    { (gamePhase === "setup") ? 
    <>
      <header>
        <h1>Set Up Match</h1>
        <select ref={matchTypeSelect} onChange={()=>{setNumPlayers(parseInt(matchTypeSelect.current.value))}}>
          <option value="2">Two Player</option>
          <option value="4">Four Player</option>
        </select>

        <h2>{numPlayers === 2 ? "Player One" : "Team One"}</h2>
        <select defaultValue="-1" name="selectplayerone" ref={p1Select} onChange={()=>{updateTeam(1)}}>
          <option value="-1" disabled>select player</option>
          {props.usersdata.map(user => {
            let disabled = true;
            if(playerIsAvailable(user.id)){
              disabled = false;
            }
            return <option disabled={disabled} key={user.id} value={user.id}>{user.info.firstname} {user.info.lastname}</option>
          })}
        </select>
        {numPlayers === 2 ? "" : 
          <select defaultValue="-1" name="selectplayertwo" ref={p2Select} onChange={()=>{updateTeam(1)}}>
            <option value="-1" disabled>select player</option>
            {props.usersdata.map(user => {
              let disabled = true;
              if(playerIsAvailable(user.id)){
                disabled = false;
              }
              return <option disabled={disabled} key={user.id} value={user.id}>{user.info.firstname} {user.info.lastname}</option>
            })}
          </select>
        }
        <h2>{numPlayers === 2 ? "Player Two" : "Team Two"}</h2>
        <select defaultValue="-1" name="selectplayerthree" ref={p3Select} onChange={()=>{updateTeam(2)}}>
          <option value="-1" disabled>select player</option>
          {props.usersdata.map(user => {
            let disabled = true;
            if(playerIsAvailable(user.id)){
              disabled = false;
            }
            return <option disabled={disabled} key={user.id} value={user.id}>{user.info.firstname} {user.info.lastname}</option>
          })}
        </select>
        {numPlayers === 2 ? "" : 
          <select defaultValue="-1" name="selectplayerfour" ref={p4Select} onChange={()=>{updateTeam(2)}}>
            <option value="-1" disabled>select player</option>
            {props.usersdata.map(user => {
              let disabled = true;
              if(playerIsAvailable(user.id)){
                disabled = false;
              }
              return <option disabled={disabled} key={user.id} value={user.id}>{user.info.firstname} {user.info.lastname}</option>
            })}
          </select>
        }
      </header>
      <button onClick={()=>{setgamePhase("match")}}>Next</button>
    </>
    : <Match backfn={()=>{setgamePhase("setup")}} numPlayers={numPlayers} teamone={team1} teamtwo={team2}/>
    }
  </>);
}

function Match({numPlayers, teamone, teamtwo, backfn}){
  if(numPlayers === 2){
    return <>{teamone[0]} {teamtwo[0]} <button onClick={backfn}>Back</button></>
  } else if (numPlayers === 4){
    return <>{teamone[0]} & {teamone[1]} VS {teamtwo[0]} & {teamtwo[1]}<button onClick={backfn}>Back</button> </>
  }


}



{/* <div className={styles.side1}>
      <h2 className={styles.p1}>Billy</h2>
      <button className={styles.scoreButton2}>+</button>
      <button className={styles.scoreButton2}>-</button>
      <h1 className={styles.score1}>4</h1>
      <h2 className={styles.p3}>Bob</h2>
      
    </div>
    

    <div className={styles.side2}>
      <h2 className={styles.p2}>Joe</h2>
      <button className={styles.scoreButton2}>+</button>
      <button className={styles.scoreButton2}>-</button>
      <h1 className={styles.score2}>4</h1>
      <h2 className={styles.p4}>Will</h2>
    </div> */}