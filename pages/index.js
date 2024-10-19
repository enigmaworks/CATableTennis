import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/index.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    await fetch(process.env.URL + "/api/users/rank", {method: "POST"});
    const sitedata = await fetch(
      process.env.URL + "/api/sitedata?" + new URLSearchParams({leaderboard_players: true, last_leaderboard_update: true, leaderboard_update_frequency: true}).toString(),
      Object.assign(req, {next: {revalidate: 900}})
    ).then(response => {return response.json()});

    const leaderboard_players = sitedata.leaderboard_players;

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
    }).toString();

    let data = await fetch(
      process.env.URL + "/api/users/getall?" + usersParams, 
      req
    ).then(response => {return response.json()});    

    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user, usersdata: data, sitedata: sitedata}}
    } else {
      return {props: { signedin: false, user: null, usersdata: data, sitedata: sitedata}}
    }
  }
);

export default function Home(props){
  let leaderboard = props.usersdata;
  function isDuplicateRank(i, rank){
    if(((i !== 0 && leaderboard[i - 1].stats_rank) === rank) || ((i !== (leaderboard.length-1)) && leaderboard[i + 1].stats_rank === rank)){
      return true;
    } else {
      return false;
    }
  }

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
              <li className={styles.rank}>{user.stats_rank}{isDuplicateRank(i, user.stats_rank) ? "*": ""}</li>
              <li><h4 className={styles.name}>{user.info_first_name} {user.info_last_name}</h4></li>
              <li className={styles.stat}>{user.stats_elo.toFixed(3)}</li>
              <li className={styles.stat}>{Math.round(calculateWinPercent(user.stats_w, user.stats_l) * 10000) / 100}%</li>
              <li className={styles.stat}>{user.stats_w}</li>
              <li className={styles.stat}>{user.stats_l}</li>
            </ul>
          </li>);
        })}
      </ol>
      <div className={styles.rankingdates}>
        <p>
          Ranked on {new Date(props.sitedata.last_leaderboard_update).toLocaleDateString()}
        </p>
        <p>
          Next ranking released {new Date(new Date(props.sitedata.last_leaderboard_update).getTime() + (props.sitedata.leaderboard_update_frequency * 86400000)).toLocaleDateString()}
        </p>
      </div>
    </section>
  </>);
}

function calculateWinPercent(w,l){
  if(w === 0) return 0;
  return (w / (w + l));
}