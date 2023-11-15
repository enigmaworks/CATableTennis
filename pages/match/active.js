import { useRouter } from "next/router";
import { useState } from "react";
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

  return(
    <>
    <FullScreen handle={fullscreenHandle}>
      <div className={styles.scoreboard} data-fullscreen={fullscreenHandle.active}>
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