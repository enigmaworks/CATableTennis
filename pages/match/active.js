import Router, { useRouter } from "next/router";
import { useRef, useState } from "react";
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
  const {query} = useRouter();
  
  if(query.p1 === undefined || query.p1 === undefined || query.p1 === undefined|| query.p1 === undefined){
    Router.push("/match");
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
    } else {
      timer.pause()
    }
  }

  function TimerRenderer({minutes, seconds, api}){
    if(!(api.isPaused() || api.isStopped())){
      minutesInput.current.value = zeroPad(minutes);
      secondsInput.current.value = zeroPad(seconds);
    }
    return(
      <>
        <input
          type="number"
          defaultValue={10}
          ref={minutesInput}
          min={0}
          max={59}
          disabled={!(api.isPaused() || api.isStopped())}
        />
        <input
          type="number"
          defaultValue={0}
          ref={secondsInput}
          min={0}
          max={59}
          disabled={!(api.isPaused() || api.isStopped())}
        />

        <button className="fitcontentwidth" onClick={() => { handleStartStop(api) }}>
          {api.isPaused() || api.isStopped() ? "Start" : "Stop"}
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
      <button >Save Result</button>
      <Link className="button light" href="/match">Quit Match</Link>
      <button className={`${styles.fullscreenbutton} fitcontentwidth light`} onClick={fullscreenHandle.enter}>
        <FontAwesomeIcon icon={faExpand}/>
      </button>
    </div>
    <FullScreen handle={fullscreenHandle}>
      <Countdown date={timerDate} autoStart={false} renderer={TimerRenderer}/>
      <div className={styles.scoreboard} data-fullscreen={fullscreenHandle.active}>
        <div className={styles.teamOne}>
          <div className={styles.playerTop}>{team1[0].info.firstname} {team1[0].info.lastname}</div>
          {parseInt(query.players) == 4 ? <>
            <div className={styles.playerBottom}>{team1[1].info.firstname} {team1[1].info.lastname}</div>
          </> : "" }
          <div className={styles.scorecontainer} data-winning={team1Score >= team2Score}>
            <div className={styles.score}>{team1Score}</div>
            <div className={styles.buttoncontainer}>
              <button className="light" onClick={() => {setTeam1Score(team1Score + 1)}}>+</button>
              <button className="light" onClick={() => {if(team1Score > 0) setTeam1Score(team1Score - 1)}}>-</button>
            </div>
          </div>
        </div>
        <div className={styles.teamTwo}>
          <div className={styles.playerTop}>{team2[0].info.firstname} {team2[0].info.lastname}</div>
          {parseInt(query.players) == 4 ? <>
            <div className={styles.playerBottom}>{team2[1].info.firstname} {team2[1].info.lastname}</div>
          </> : "" }
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