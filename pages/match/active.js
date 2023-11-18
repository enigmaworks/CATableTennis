import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/match.module.css";
import Link from "next/link";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import Countdown, { zeroPad } from "react-countdown";

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
  let {query} = useRouter();

  if(query.p1 === undefined || query.p1 === undefined || query.p1 === undefined|| query.p1 === undefined){
    useEffect(()=>{
      Router.push("/match");
    },[])
    return (<></>);
  }

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  let team1 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1b))];
  let team2 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2b))];
  let fullscreenHandle = useFullScreenHandle();

  const [timerDate, setTimerDate] = useState(Date.now() + 600000);
  const secondsInput = useRef();
  const minutesInput = useRef();

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
      Router.push({
        pathname: '/match/save',
        query: {
          win1: team1[0],
          win2: team1[1],
          lose1: team2[0],
          lose2: team2[1],
        }
      }, "/match/save");
    } else if(team2Score > team1Score){
      Router.push({
        pathname: '/match/save',
        query: {
          win1: team2[0],
          win2: team2[1],
          lose1: team1[0],
          lose2: team1[1],
        }
      }, "/match/save");
    } else {
      alert("can't save tie games")
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
            {team1[0].info.firstname} {team1[0].info.lastname}
            {team1[1] !== undefined ? <div className={styles.spacer}>&</div> : ""}
            {team1[1] !== undefined ? `${team1[1].info.firstname} ${team1[1].info.lastname}`: ""}
         </div>
          <div className={styles.scorecontainer} data-winning={team1Score >= team2Score}>
            <div className={styles.score}>{team1Score}</div>
            <div className={styles.buttoncontainer}>
              <button className="light" onClick={() => {setTeam1Score(team1Score + 1)}}>+</button>
              <button className="light" onClick={() => {if(team1Score > 0) setTeam1Score(team1Score - 1)}}>-</button>
            </div>
          </div>
        </div>
        <div className={styles.teamTwo}>
          <div className={styles.players}>
            {team2[0].info.firstname} {team2[0].info.lastname}
            {team2[1] !== undefined ? <div className={styles.spacer}>&</div> : ""}
            {team2[1] !== undefined ? `${team2[1].info.firstname} ${team2[1].info.lastname}`: ""}
         </div>
          <div className={styles.scorecontainer} data-winning={team2Score >= team1Score}>
            <div className={styles.score}>{team2Score}</div>
            <div className={styles.buttoncontainer}>
              <button className="light" onClick={() => {setTeam2Score(team2Score + 1)}}>+</button>
              <button className="light" onClick={() => {if(team2Score > 0) setTeam2Score(team2Score - 1)}}>-</button>
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
    </>
  );
}