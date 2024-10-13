import { withSessionSsr  } from "/helpers/withIronSession";
import Head from 'next/head';
import { headers } from "../next.config";
import styles from "/styles/players.module.css";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    let data = await fetch(process.env.URL + "/api/users/getdata", req);
    data = await data.json();

    if(user){
      return {props: { signedin: true, user: user, usersdata: data }}
    } else {
      return {props: { signedin: false, user: null, usersdata: data }}
    }
  }
);

export default function Players(props){
  let now = new Date();
  let graduatedPlayers = [];
  let currentPlayers = []; 

  for(let i = 0; i < props.usersdata.length; i++){
    let player = props.usersdata[i];
    let graduationDate = new Date("7/01/" + player.info.gradyear);
    if(now < graduationDate){
      currentPlayers.push(player);
    } else {
      graduatedPlayers.push(player);
    }
  }
  return (<>
  <Head>
    <title>Players | Caravel Table Tennis</title>
  </Head>
  <header>
    <h1>Players</h1>
  </header>
  <section>
      <ul className={styles.playerslist}>
        {currentPlayers.map((player, i)=>{
          return (
            <li id={i} className={styles.playercontainer}>
              <ul className={styles.player}>
                <li>
                  {player.info.firstname} {player.info.lastname}
                  <span className={styles.gradyear}>'{player.info.gradyear.substring(2)}</span>
                  <span className={styles.flair}>{player.info.flair === ''? '' : player.info.flair}</span>
                </li>
                <li className={styles.record}>{player.statistics.w} - {player.statistics.l}</li>
              </ul>
            </li>
          );
        })}
      </ul>
      <h2 className={styles.alumheader}>Alum</h2>
      <ul className={styles.playerslist}>
        {graduatedPlayers.map((player, i)=>{
            return (
              <li id={i} className={styles.playercontainer}>
              <ul className={styles.player}>
                <li>
                  {player.info.firstname} {player.info.lastname}
                  <span className={styles.gradyear}>'{player.info.gradyear.substring(2)}</span>
                  <span className={styles.flair}>{player.info.flair === ''? '' : player.info.flair}</span>
                </li>
                <li className={styles.record}>{player.statistics.w} - {player.statistics.l}</li>
              </ul>
            </li>
            );
          })}
      </ul>
  </section>
  </>);
}