import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/index.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    await fetch(process.env.URL + "/api/users/rank", {method: "POST"});
    const {leaderboard_players} = await fetch(process.env.URL + "/api/sitedata?" + new URLSearchParams({leaderboard_players: true}).toString(), req).then(response => {return response.json()});

    let usersParams = new URLSearchParams({
      modifier: "current",
      sort_column: "stats_rank",
      sort_column_2: "info_last_name",
      num: leaderboard_players,
      ignore_unranked: true,
      id:true,
      info_first_name:true,
      info_last_name: true,
      info_graduation: true,
      stats_w: true,
      stats_l: true,
      stats_elo: true,
      stats_rank: true
    });

    let data = await fetch(process.env.URL + "/api/users/getall?" + usersParams.toString(), req).then(response => {return response.json()});    

    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user, usersdata: data}}
    } else {
      return {props: { signedin: false, user: null, usersdata: data}}
    }
  }
);

export default function Home(props){
  let leaderboard = props.usersdata;

  return (<>
    <Head>
      <title>Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>Caravel Academy Table Tennis Club</h1>
    </header>
    <section>
      <div className={styles.titleAndOptions}>
        <h2>Leaderboard</h2>
      </div>
      <ol className={styles.leaderboard}>
        <li className={styles.headerrow}>
          <ul>
            <li className={styles.rank}><h3>Rank</h3></li>
            <li><h3>Player</h3></li>
            <li className={styles.stat}><h3>Elo</h3></li>
            <li className={styles.stat}><h3>Win %</h3></li>
            <li className={styles.stat}><h3>Wins</h3></li>
            <li className={styles.stat}><h3>Losses</h3></li>
          </ul>
        </li>
        {leaderboard.map((user, i) => {
          return (
          <li className={styles.player} key={i}>
            <ul className={styles.playerstats}>
              <li className={styles.rank}>{user.stats_rank}</li>
              <li><h4 className={styles.name}>{user.info_first_name} {user.info_last_name}</h4></li>
              <li className={styles.stat}>{Math.round(user.stats_elo*100)/100}</li>
              <li className={styles.stat}>{Math.round(calculateWinPercent(user.stats_w, user.stats_l) * 10000) / 100}%</li>
              <li className={styles.stat}>{user.stats_w}</li>
              <li className={styles.stat}>{user.stats_l}</li>
            </ul>
          </li>);
        })}
      </ol>
    </section>
  </>);
}

function calculateWinPercent(w,l){
  if(w === 0) return 0;
  return (w / (w + l));
}