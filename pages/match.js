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

  if(gamePhase === "setup"){

  return (
  <>
    <Head>
      <title>Match | Caravel Table Tennis </title>
    </Head>
    <header>
      <h1>Match</h1>
    </header>
    <section>
      <h2>Setup</h2>
      <select ref={matchTypeSelect} onChange={()=>{setNumPlayers(parseInt(matchTypeSelect.current.value))}}>
        <option value="2">Two Player</option>
        <option value="4">Four Player</option>
      </select>
      <div>
        <h3>{numPlayers === 2 ? "Player One" : "Team One"}</h3>
        <UserSelect usersdata={props.usersdata} refobj={p1Select} checkfn={playerIsAvailable} changefn={()=>{updateTeam(1)}}></UserSelect>
        {numPlayers === 4 ? <UserSelect usersdata={props.usersdata} refobj={p2Select} checkfn={playerIsAvailable} changefn={()=>{updateTeam(1)}}></UserSelect> : ""}
      </div>

      <div>
        <h3>{numPlayers === 2 ? "Player Two" : "Team Two"}</h3>
        <UserSelect usersdata={props.usersdata} refobj={p3Select} checkfn={playerIsAvailable} changefn={()=>{updateTeam(2)}}></UserSelect>
        {numPlayers === 4 ? <UserSelect usersdata={props.usersdata} refobj={p4Select} checkfn={playerIsAvailable} changefn={()=>{updateTeam(2)}}></UserSelect> : ""}
      </div>
      
      <button onClick={()=>{setgamePhase("match")}}>Next</button>
    </section>
  </>);
  }
  if(gamePhase === "match"){
    return(<Match backfn={()=>{setgamePhase("setup")}} numPlayers={numPlayers} teamone={team1} teamtwo={team2}/>)
  }
}

function Match({numPlayers, teamone, teamtwo, backfn}){
  if(numPlayers === 2){
    return <>{teamone[0]} {teamtwo[0]} <button onClick={backfn}>Back</button></>
  } else if (numPlayers === 4){
    return <>{teamone[0]} & {teamone[1]} VS {teamtwo[0]} & {teamtwo[1]}<button onClick={backfn}>Back</button> </>
  }
}

function UserSelect({usersdata, refobj, checkfn, changefn}){
  return(
    <select defaultValue="-1" name="selectplayerfour" ref={refobj} onChange={()=>{changefn()}}>
      <option value="-1" disabled>select player</option>
      {usersdata.map(user => {
        let disabled = true;
        if(checkfn(user.id)){
          disabled = false;
        }
        return <option disabled={disabled} key={user.id} value={user.id}>{user.info.firstname} {user.info.lastname}</option>
      })}
    </select>
  )
}