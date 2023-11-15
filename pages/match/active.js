import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/match.module.css";
import Link from "next/link";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

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

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  let team1 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1b))];
  let team2 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2b))];
  let fullscreenHandle = useFullScreenHandle();

  const timer = useRef();
  const [timerValue, setTimerValue] = useState("0000");
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(Date.now());
  const [timerEndTime, setEndStartTime] = useState(Date.now());

  function handleTimerInput() {
    stopTimer();
    let value = timer.current.value;
    value = value.replaceAll(/\D/gi, "");

    while(value.length < 4){
      value = "0" + value;
    }
    while(value.length > 4){
      value = value.substring(1);
    }
    setTimerValue(value);
  }

  return(
    <>
    <FullScreen handle={fullscreenHandle}>
      <div className={styles.scoreboard} data-fullscreen={fullscreenHandle.active}>
        <div className={styles.timercontainer}>
          <input type="text" className={styles.timer} value={timerValue.substring(0,2) + ":" + timerValue.substring(2)} onInput={handleTimerInput} ref={timer}/>
          <button className={styles.timerbutton} data-timer-active={timerIsActive} onClick={()=>{setTimerIsActive(!timerIsActive)}}></button>
        </div>
        <div className={styles.teamOne}>
          <div className={styles.playerTop}>{team1[0].info.firstname} {team1[0].info.lastname}</div>
          {parseInt(query.players) == 4 ? <>
            <div className={styles.playerBottom}>{team1[1].info.firstname} {team1[1].info.lastname}</div>
          </> : "" }
          <div className={styles.scorecontainer} data-winning={team1Score >= team2Score}>
            <div className={styles.score}>{team1Score}</div>
            <div className={styles.buttoncontainer}>
              <button onClick={() => {setTeam1Score(team1Score + 1)}}>+</button>
              <button onClick={() => {if(team1Score > 0) setTeam1Score(team1Score - 1)}}>-</button>
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
              <button onClick={() => {setTeam2Score(team2Score + 1)}}>+</button>
              <button onClick={() => {if(team2Score > 0) setTeam2Score(team2Score - 1)}}>-</button>
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
    <div className={styles.actions}>
      <button onClick={fullscreenHandle.enter}>Enter Fullscreen</button>
      <Link href="/match">Exit to Options</Link>
    </div>
    </>
  );
}