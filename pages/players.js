import { withSessionSsr  } from "/helpers/withIronSession";
import Head from 'next/head';
import { headers } from "../next.config";
import styles from "/styles/players.module.css";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    const params = {
      sort_column: 'info_last_name',
      info_flair: true,
      info_first_name:true,
      info_last_name: true,
      info_graduation: true,
      stats_w: true,
      stats_l: true
    };
    
    const currentParams = new URLSearchParams({modifier: "current", ...params}).toString();
    const graduatedParams = new URLSearchParams({modifier: "graduated", ...params}).toString();

    let [current, graduated] = await Promise.all([
      fetch(process.env.URL + "/api/users/getall?" + currentParams, Object.assign(req, {next: {revalidate: 900}})).then(response => {return response.json()}),
      fetch(process.env.URL + "/api/users/getall?" + graduatedParams, Object.assign(req, {next: {revalidate: 900}})).then(response => {return response.json()})
    ]);

    if(user){
      return {props: { signedin: true, user: user, currentPlayers: current, graduatedPlayers: graduated}}
    } else {
      return {props: { signedin: false, user: null, currentPlayers: current, graduatedPlayers: graduated}}
    }
  }
);

export default function Players(props){
  let graduatedPlayers = props.graduatedPlayers;
  let currentPlayers = props.currentPlayers; 

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
            <li id={i} key={i} className={styles.playercontainer}>
              <ul className={styles.player}>
                <li>
                  {player.info_first_name} {player.info_last_name}
                  <span className={styles.gradyear}>'{new Date(player.info_graduation).getFullYear().toString().substring(2)}</span>
                  <span className={styles.flair}>{player.info_flair === ''? '' : player.info_flair}</span>
                </li>
                <li className={styles.record}>{player.stats_w} - {player.stats_l}</li>
              </ul>
            </li>
          );
        })}
      </ul>
      {graduatedPlayers.length > 0 ? <h2 className={styles.alumheader}>Alum</h2> : ""}
      <ul className={styles.playerslist}>
        {graduatedPlayers.map((player, i)=>{
            return (
              <li id={i} key={i} className={styles.playercontainer}>
              <ul className={styles.player}>
                <li>
                  {player.info_first_name} {player.info_last_name}
                  <span className={styles.gradyear}>'{new Date(player.info_graduation).getFullYear().toString().substring(2)}</span>
                  <span className={styles.flair}>{player.info_flair === ''? '' : player.info_flair}</span>
                </li>
                <li className={styles.record}>{player.stats_w} - {player.stats_l}</li>
              </ul>
            </li>
            );
          })}
      </ul>
  </section>
  </>);
}