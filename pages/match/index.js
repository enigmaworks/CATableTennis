import { withSessionSsr  } from "helpers/withIronSession";
import Select from 'react-select'; 
import selectTheme from 'helpers/select-theme.js';
import styles from "styles/match.module.css";
import { useRef, useState } from "react";
import Router from "next/router";
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
  const [numPlayers, setNumPlayers] = useState(2);
  const [team1, setTeam1] = useState([props.usersdata[0].id]);
  const [team2, setTeam2] = useState([props.usersdata[1].id]);
  const [useTimer, setUseTimer] = useState(false);
  const timerCheckbox = useRef();

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
          isSearchable={false}
          defaultValue={{value:2, label: "Solo Match "}}
          theme={selectTheme}
          options={[
            {value:2, label: "Solo Match"},
            {value:4, label: "Team Match"}]
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

        <div>
          <label htmlFor="usetimer">Use Timer</label>
          <input
            type="checkbox"
            name="usetimer"
            id="usetimer"
            ref={timerCheckbox}
            onChange={()=>{setUseTimer(timerCheckbox.current.checked);}}
          />
          <button className="important" onClick={()=>{
            if(numPlayers === 2){
              Router.push({
                pathname: 'match/active',
                query: {
                  players: numPlayers,
                  p1: team1[0],
                  p2: team2[0],
                  timer: useTimer,
                }
              }, 'match');
            } else {
              Router.push({
                pathname: 'match/active',
                query: {
                  players: numPlayers,
                  p1: team1[0],
                  p2: team2[0],
                  p1b: team1[1],
                  p2b: team2[1],
                  timer: useTimer,
                }
              }, 'match');
            }
          }}>Start Match</button>
        </div>
      </section>
    </>);
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