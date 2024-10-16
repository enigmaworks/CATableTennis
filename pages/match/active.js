import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/match.module.css";
import Link from "next/link";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import Countdown, { zeroPad } from "react-countdown";
import toast, { Toaster } from 'react-hot-toast';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {    
    const user = req.session.user;
    if(user && user.permissions >= 1){
      return {props: { signedin: true, user: user}}
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
  //check that both players for both teams are present 1v1 or full 2v2 teams
  let {query} = useRouter();
  if((query.p1_id === undefined || query.p2_id === undefined) && ((query.p3_id !== undefined && query.p4_id !== undefined) || (query.p3_id === undefined && query.p4_id === undefined))){
    useEffect(()=>{
      Router.push("/match");
    },[])
    return (<></>);
  }

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [timerDate, setTimerDate] = useState(Date.now() + 600000);
  const secondsInput = useRef();
  const minutesInput = useRef();
  
  let fullscreenHandle = useFullScreenHandle();

  function userObj(id, firstname, lastname, w, l){
    return {id: id, info_first_name: firstname, info_last_name: lastname, stats_w: w, stats_l: l};
  }

  let team1 = [userObj(query.p1_id, query.p1_first, query.p1_last, query.p1_w, query.p1_l)];
  let team2 = [userObj(query.p2_id, query.p2_first, query.p2_last, query.p2_w, query.p2_l)];
  if(query.numplayers === "4"){
    team1.push(userObj(query.p3_id, query.p3_first, query.p3_last, query.p3_w, query.p3_l));
    team2.push(userObj(query.p4_id, query.p4_first, query.p4_last, query.p4_w, query.p4_l));
  }

  function handleStartStop(timer){
    if(timer.isStopped() || timer.isPaused()){
      const sec = parseInt(secondsInput.current.value);
      const min = parseInt(minutesInput.current.value);
      setTimerDate(Date.now() + (sec * 1000) + (min * 1000 * 60));
      timer.start();
    } else if (timer.isCompleted()){
      restartTimer(timer);
    } else {
      timer.pause()
    }
  }

  function restartTimer(timer){
    secondsInput.current.value = "00";
    minutesInput.current.value = "10";
    timer.stop();
  }

  function cleanInput(ref){
    ref.current.value = ref.current.value.replaceAll(/\D/gi,"");
    ref.current.value = ref.current.value.substring(ref.current.value.length - 2);
    if(ref.current.value === "") ref.current.value = 0;
  }

  function saveresult(){
    if(team1Score > team2Score){
      if(query.numplayers === "4"){
        Router.push({
          pathname: '/match/save',
          query: {
            numplayers: query.numplayers,

            win1_id: team1[0].id,
            win1_first: team1[0].info_first_name,
            win1_last: team1[0].info_last_name,
            win1_w: team1[0].stats_w,
            win1_l: team1[0].stats_l,

            win2_id: team1[1].id,
            win2_first: team1[1].info_first_name,
            win2_last: team1[1].info_last_name,
            win2_w: team1[1].stats_w,
            win2_l: team1[1].stats_l,

            lose1_id: team2[0].id,
            lose1_first: team2[0].info_first_name,
            lose1_last: team2[0].info_last_name,
            lose1_w: team2[0].stats_w,
            lose1_l: team2[0].stats_l,

            lose2_id: team2[1].id,
            lose2_first: team2[1].info_first_name,
            lose2_last: team2[1].info_last_name,
            lose2_w: team2[1].stats_w,
            lose2_l: team2[1].stats_l,
          }
        });
      } else {
        Router.push({
          pathname: '/match/save',
          query: {
            numplayers: query.numplayers,

            win1_id: team1[0].id,
            win1_first: team1[0].info_first_name,
            win1_last: team1[0].info_last_name,
            win1_w: team1[0].stats_w,
            win1_l: team1[0].stats_l,

            lose1_id: team2[0].id,
            lose1_first: team2[0].info_first_name,
            lose1_last: team2[0].info_last_name,
            lose1_w: team2[0].stats_w,
            lose1_l: team2[0].stats_l,
          }
        });
      }
    } else if(team2Score > team1Score){
      if(query.numplayers === "4"){
        Router.push({
          pathname: '/match/save',
          query: {
            numplayers: query.numplayers,

            win1_id: team2[0].id,
            win1_first: team2[0].info_first_name,
            win1_last: team2[0].info_last_name,
            win1_w: team2[0].stats_w,
            win1_l: team2[0].stats_l,

            win2_id: team2[1].id,
            win2_first: team2[1].info_first_name,
            win2_last: team2[1].info_last_name,
            win2_w: team2[1].stats_w,
            win2_l: team2[1].stats_l,

            lose1_id: team1[0].id,
            lose1_first: team1[0].info_first_name,
            lose1_last: team1[0].info_last_name,
            lose1_w: team1[0].stats_w,
            lose1_l: team1[0].stats_l,

            lose2_id: team1[1].id,
            lose2_first: team1[1].info_first_name,
            lose2_last: team1[1].info_last_name,
            lose2_w: team1[1].stats_w,
            lose2_l: team1[1].stats_l,
          }
        }, '/match/save');
      } else {
        Router.push({
          pathname: '/match/save',
          query: {
            numplayers: query.numplayers,

            win1_id: team2[0].id,
            win1_first: team2[0].info_first_name,
            win1_last: team2[0].info_last_name,
            win1_w: team2[0].stats_w,
            win1_l: team2[0].stats_l,

            lose1_id: team1[0].id,
            lose1_first: team1[0].info_first_name,
            lose1_last: team1[0].info_last_name,
            lose1_w: team1[0].stats_w,
            lose1_l: team1[0].stats_l,
          }
        }, '/match/save');
      }
    } else {
      toast.error("Need a winner to save!")
    }
  }

  function TimerRenderer({minutes, seconds, api, completed}){
    if(!(api.isPaused() || api.isStopped())){
      minutesInput.current.value = zeroPad(minutes);
      secondsInput.current.value = zeroPad(seconds);
    }
    return(
      <>
        <input
          type="text"
          inputMode="numeric"
          defaultValue={10}
          disabled={!(api.isPaused() || api.isStopped())}
          ref={minutesInput}
          onChange={()=>{cleanInput(minutesInput)}}
          data-completed={completed}
          className={styles.timerValue}
        />
        <div className={styles.colon}>:</div>
        <input
          type="text"
          inputMode="numeric"
          defaultValue="00"
          disabled={!(api.isPaused() || api.isStopped())}
          ref={secondsInput}
          onChange={()=>{cleanInput(secondsInput)}}
          data-completed={completed}
          className={styles.timerValue}
        />

        <button className={`fitcontentwidth light ${styles.timerButton}`} onClick={() => { handleStartStop(api) }}>
          {api.isPaused() || api.isStopped() ? "Start" : (api.isCompleted()) ? "Reset" : "Stop"}
        </button>
      </>
    )
  }

  return(
    <>
    <header>
      <h1>{query.p1b !== undefined ? "Team Match" : "Solo Match"}</h1>
    </header>
    <Toaster position="bottom-center" reverseOrder={false}/>
    <div className={styles.actions}>
      <button onClick={saveresult}>Save Result</button>
      <Link className="button light" href="/match">Quit Match</Link>
      <button className={`${styles.fullscreenbutton} fitcontentwidth light`} onClick={fullscreenHandle.enter}>
        <FontAwesomeIcon icon={faExpand}/>
      </button>
    </div>
    <FullScreen handle={fullscreenHandle}>
      <div className={styles.scoreboard} data-fullscreen={fullscreenHandle.active}>
        {query.timer === "true" ? <div className={styles.timercontainer}>
          <Countdown date={timerDate} autoStart={false} renderer={TimerRenderer}/>
        </div> : ""}
        <div className={styles.teamOne}>
          <div className={styles.players}>
            {team1[0].info_first_name} {team1[0].info_last_name}
            {team1[1] !== undefined ? <div className={styles.spacer}>&</div> : ""}
            {team1[1] !== undefined ? `${team1[1].info_first_name} ${team1[1].info_last_name}`: ""}
         </div>
          <div className={styles.scorecontainer} data-winning={team1Score > team2Score}>
            <div className={styles.score}>{team1Score}</div>
            <div className={styles.buttoncontainer}>
              <button className="light" onClick={() => {if(team1Score > 0) setTeam1Score(team1Score - 1)}}>-</button>
              <button className="light" onClick={() => {setTeam1Score(team1Score + 1)}}>+</button>
            </div>
          </div>
        </div>
        <div className={styles.teamTwo}>
          <div className={styles.players}>
            {team2[0].info_first_name} {team2[0].info_last_name}
            {team2[1] !== undefined ? <div className={styles.spacer}>&</div> : ""}
            {team2[1] !== undefined ? `${team2[1].info_first_name} ${team2[1].info_last_name}`: ""}
         </div>
          <div className={styles.scorecontainer} data-winning={team2Score > team1Score}>
            <div className={styles.score}>{team2Score}</div>
            <div className={styles.buttoncontainer}>
              <button className="light" onClick={() => {if(team2Score > 0) setTeam2Score(team2Score - 1)}}>-</button>
              <button className="light" onClick={() => {setTeam2Score(team2Score + 1)}}>+</button>
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
    </>
  );
}