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

export default function MatchPage(props){
  const [gamePhase, setgamePhase] = useState("setup");
  const [numPlayers, setNumPlayers] = useState(2);
  const [team1, setTeam1] = useState([props.usersdata[0].id]);
  const [team2, setTeam2] = useState([props.usersdata[1].id]);
  const matchTypeSelect = useRef();
  const p1Select = useRef();
  const p2Select = useRef();
  const p3Select = useRef();
  const p4Select = useRef();

  function playerIsAvailable(id){
    if(team1.includes(id) || team2.includes(id)) return true;
    return false;
  }
  function handleNumPlayersChange(){
    let num = parseInt(matchTypeSelect.current.value)
    setNumPlayers(num);
    if(num === 2){
      setTeam1([team1[0]])
      setTeam2([team2[0]])
    } else {
      setTeam1([props.usersdata[0].id, props.usersdata[2].id])
      setTeam2([props.usersdata[1].id, props.usersdata[3].id])
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
      <select
        ref={matchTypeSelect}
        onChange={handleNumPlayersChange}
      >
        <option value="2">Two Player</option>
        <option value="4">Four Player</option>
      </select>
      <div>
        <h3>{numPlayers === 2 ? "Player One" : "Team One"}</h3>
        <UserSelect
          defaultvalue={team1[0]}
          usersdata={props.usersdata}
          refobj={p1Select}
          checkfn={playerIsAvailable}
          changefn={ ()=>{updateTeam(1)} }
        />
        { (numPlayers === 4) ?
          <UserSelect
            defaultvalue={team1[1]}
            usersdata={props.usersdata}
            refobj={p2Select}
            checkfn={playerIsAvailable} 
            changefn={()=>{updateTeam(1)}}
          /> 
        : ""}

      </div>

      <div>
        <h3>{numPlayers === 2 ? "Player Two" : "Team Two"}</h3>
        <UserSelect
          defaultvalue={team2[0]}
          usersdata={props.usersdata}
          refobj={p3Select}
          checkfn={playerIsAvailable}
          changefn={ ()=>{updateTeam(2)} }
        />
        { (numPlayers === 4) ?
          <UserSelect
            defaultvalue={team2[1]}
            usersdata={props.usersdata}
            refobj={p4Select}
            checkfn={playerIsAvailable} 
            changefn={()=>{updateTeam(2)}}
          /> 
        : ""}
       </div>
      
      <button onClick={()=>{
        if(team1.length + team2.length === numPlayers){
          setgamePhase("match")
        }
        }}> Next </button>
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

function UserSelect({defaultvalue, usersdata, refobj, checkfn, changefn}){
  return(
    <select
      value={defaultvalue}
      name="selectplayerfour"
      ref={refobj}
      onChange={()=>{changefn()}}
    >
      { usersdata.map(user => {
        let disabled = user.id !== defaultvalue && checkfn(user.id);
        return(
          <option
            disabled={disabled}
            key={user.id}
            value={user.id}
          >
            {user.info.firstname} {user.info.lastname}
          </option>
        )
      }) }
    </select>
  )
}