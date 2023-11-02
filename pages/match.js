import { withSessionSsr  } from "helpers/lib/config/withSession";
import Select from 'react-select'; 
import selectTheme from 'helpers/select-theme.js';
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

  function checkPlayerIsAvailable(id){
    if(team1.includes(id) || team2.includes(id)) return true;
    return false;
  }
  
  function handleNumPlayersChange(option){
    let num = parseInt(option.value)
    setNumPlayers(num);
    if(num === 2){
      setTeam1([team1[0]])
      setTeam2([team2[0]])
    } else {
      setTeam1([props.usersdata[0].id, props.usersdata[2].id])
      setTeam2([props.usersdata[1].id, props.usersdata[3].id])
    }
  }

  function updateTeam(teamnum, player, option){
    if(player === 1){
      if(teamnum===1){
        if(numPlayers === 2){
          setTeam1([parseInt(option.value)]);
        } else {
          setTeam1([parseInt(option.value), team1[1]]);
        }
      } else {
        if(numPlayers === 2){
          setTeam2([parseInt(option.value)]);
        } else {
          setTeam2([parseInt(option.value), team2[1]]);
        }
      }
    } else if (player === 2) {
      if(teamnum===1){
        setTeam1([team1[0], parseInt(option.value)]);
      } else {
        setTeam2([team2[0], parseInt(option.value)]);
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
          <Select
            onChange={handleNumPlayersChange}
            defaultValue={{value:2, label: "Two Players"}}
            theme={selectTheme}
            options={[
              {value:2, label: "Two Players"},
              {value:4, label: "Four Players"}]
            }
          />
          <div>
            <h3>{numPlayers === 2 ? "Player One" : "Team One"}</h3>
            <UserSelect
              defualtSelection={props.usersdata.find(user => user.id === team1[0])}
              users={props.usersdata}
              checkfn={checkPlayerIsAvailable}
              changefn={ (option)=>{updateTeam(1, 1, option)} }
              />
            { (numPlayers === 4) ?
              <UserSelect
                defualtSelection={props.usersdata.find(user => user.id === team1[1])}
                users={props.usersdata}
                checkfn={checkPlayerIsAvailable} 
                changefn={ (option)=>{updateTeam(1, 2, option)} }
              /> 
            : ""}
          </div>

          <div>
            <h3>{numPlayers === 2 ? "Player Two" : "Team Two"}</h3>
            <UserSelect
              defualtSelection={props.usersdata.find(user => user.id === team2[0])}
              users={props.usersdata}
              checkfn={checkPlayerIsAvailable}
              changefn={ (option)=>{updateTeam(2, 1, option)} }
            />
            { (numPlayers === 4) ?
              <UserSelect
                defualtSelection={props.usersdata.find(user => user.id === team2[1])}
                users={props.usersdata}
                checkfn={checkPlayerIsAvailable} 
                changefn={(option)=>{updateTeam(2, 2, option)}}
              /> 
            : ""}
          </div>
          
          <button onClick={()=>{
            if(team1.length + team2.length === numPlayers){
              setgamePhase("match")
            }
            }}> Next </button>
        </section>
      </>)
    ;
  }
  if(gamePhase === "match"){
    return( <Match
      backfn={ ()=>{ setgamePhase("setup") } }
      numPlayers={numPlayers}
      teamone={team1}
      teamtwo={team2}
    />)
  }
}

function Match({numPlayers, teamone, teamtwo, backfn}){
  if(numPlayers === 2){
    return (<>
      {teamone[0]} VS {teamtwo[0]}
      <button onClick={backfn}>Back</button>
    </>)
  } else if (numPlayers === 4){
    return (<>
      {teamone[0]} {teamone[1]} VS {teamtwo[0]} {teamtwo[1]}
      <button onClick={backfn}>Back</button>
    </>)
  }
}

function UserSelect({defualtSelection, users, checkfn, changefn}){
  return(
    <Select
      name="selectplayerfour"
      onChange={changefn}
      theme={selectTheme}
      value={{
        value: defualtSelection.id,
        label: `${defualtSelection.info.firstname} ${defualtSelection.info.lastname}`,
      }}
      options={users.map(user => {
        let disabled = user.id !== defualtSelection.id && checkfn(user.id);
        return(
          {
            isDisabled: disabled,
            value: user.id,
            label: `${user.info.firstname} ${user.info.lastname}`
          }
        )
      })
      }
    />
  )
}