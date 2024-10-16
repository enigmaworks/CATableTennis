import { withSessionSsr  } from "/helpers/withIronSession";
import Select from 'react-select'; 
import selectTheme from '/helpers/react-select-theme.js';
import styles from "/styles/match.module.css";
import { useRef, useState } from "react";
import Router from "next/router";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user && user.permissions >= 1){      
      let usersParams = new URLSearchParams({modifier: "current", id:true, info_first_name:true, info_last_name: true, info_graduation: true});
      let data = await fetch(process.env.URL + "/api/users/getall?" + usersParams.toString(), req).then(response => {return response.json()});

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
  if(props.usersdata.length < 2){
    return (
    <>
      <Head>
        <title>Match | Caravel Table Tennis </title>
      </Head>
      <header>
        <h1>Match</h1>
      </header>
      <section className="centercontent">
        <h3>Not enough active player accounts for a match!</h3>
        <p>There are less than two accounts available with players who have not already graduated.</p>
      </section>
    </>);
  }

  const [numPlayers, setNumPlayers] = useState(2);
  const [team1, setTeam1] = useState([props.usersdata[0].id]);
  const [team2, setTeam2] = useState([props.usersdata[1].id]);
  const [useTimer, setUseTimer] = useState(false);
  const timerCheckbox = useRef();
  const selectOptions = [];

  if (props.usersdata.length >= 2){
    selectOptions.push({value:2, label: "Singles Game"});
  }
  if (props.usersdata.length >= 4){
    selectOptions.push({value:4, label: "Doubles Game"});
  }

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
          defaultValue={selectOptions[0]}
          theme={selectTheme}
          options={selectOptions}
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
          <button className="important" onClick={async ()=>{
            if(numPlayers === 2){
              await getUsers(team1[0], team2[0]).then(([p1,p2]) => {
                Router.push({
                  pathname: 'match/active',
                  query: {
                    numplayers: numPlayers,
                    timer: useTimer,

                    p1_id: p1.id,
                    p1_w: p1.stats_w,
                    p1_l: p1.stats_l,
                    p1_first: p1.info_first_name,
                    p1_last: p1.info_last_name,

                    p2_id: p2.id,
                    p2_w: p2.stats_w,
                    p2_l: p2.stats_l,
                    p2_first: p2.info_first_name,
                    p2_last: p2.info_last_name,
                  }
                }, 'match');
              });
            } else {
              await getUsers(team1[0], team2[0], team1[1], team2[1]).then(([p1,p2, p3, p4]) => {
                Router.push({
                  pathname: 'match/active',
                  query: {
                    numplayers: numPlayers,
                    timer: useTimer,

                    p1_id: p1.id,
                    p1_w: p1.stats_w,
                    p1_l: p1.stats_l,
                    p1_first: p1.info_first_name,
                    p1_last: p1.info_last_name,

                    p2_id: p2.id,
                    p2_w: p2.stats_w,
                    p2_l: p2.stats_l,
                    p2_first: p2.info_first_name,
                    p2_last: p2.info_last_name,

                    p3_id: p3.id,
                    p3_w: p3.stats_w,
                    p3_l: p3.stats_l,
                    p3_first: p3.info_first_name,
                    p3_last: p3.info_last_name,

                    p4_id: p4.id,
                    p4_w: p4.stats_w,
                    p4_l: p4.stats_l,
                    p4_first: p4.info_first_name,
                    p4_last: p4.info_last_name,
                  }
                }, 'match');
              });
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
        label: `${defualtSelection.info_first_name} ${defualtSelection.info_last_name}`,
      }}
      options={users.map(user => {
        let disabled = user.id !== defualtSelection.id && checkfn(user.id);
        return(
          {
            isDisabled: disabled,
            value: user.id,
            label: `${user.info_first_name} ${user.info_last_name}`
          }
        )
      })
      }
    />
  )
}

async function getUsers(id1, id2, id3, id4){
  let u1params = new URLSearchParams({id: id1, info_first_name: true, info_last_name: true, stats_w: true, stats_l: true})
  let u2params = new URLSearchParams({id: id2, info_first_name: true, info_last_name: true, stats_w: true, stats_l: true})
  if(!id3 && !id4){
    return await Promise.all([
      fetch("http://localhost:3000/api/users/getuser?" + u1params.toString()).then(response => {return response.json()}),
      fetch("http://localhost:3000/api/users/getuser?" + u2params.toString()).then(response => {return response.json()})
    ]);
  } else {
    let u3params = new URLSearchParams({id: id3, info_first_name: true, info_last_name: true, stats_w: true, stats_l: true})
    let u4params = new URLSearchParams({id: id4, info_first_name: true, info_last_name: true, stats_w: true, stats_l: true})
    return await Promise.all([
      fetch("http://localhost:3000/api/users/getuser?" + u1params.toString()).then(response => {return response.json()}),
      fetch("http://localhost:3000/api/users/getuser?" + u2params.toString()).then(response => {return response.json()}),
      fetch("http://localhost:3000/api/users/getuser?" + u3params.toString()).then(response => {return response.json()}),
      fetch("http://localhost:3000/api/users/getuser?" + u4params.toString()).then(response => {return response.json()})
    ]);
  }
}