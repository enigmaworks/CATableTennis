import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/index.module.css";
import Head from 'next/head';
import { useState } from "react";
import { calculateEloAndWinPercents, rankByElo, rankByTotalWins, rankByWinPercent } from "/helpers/rankingFunctions";
import Select from 'react-select'; 
import selectTheme from 'helpers/select-theme.js';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    let data = await fetch(process.env.URL + "/api/users/getdata", req);
    data = await data.json();
    data = calculateEloAndWinPercents(data);

    const site = await fetch(process.env.URL + "/api/sitedata", {method:"GET"});
    const {numplayersonleaderboard} = await site.json();

    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user, usersdata: data, numplayersonleaderboard: numplayersonleaderboard}}
    } else {
      return {props: { signedin: false, user: null, usersdata: data, numplayersonleaderboard: numplayersonleaderboard }}
    }
  }
);

export default function Home(props){
  const [showAll, setShowAll] = useState(false);
  const [rankingAlgorithm, setRankingAlgorithm] = useState("elo");
  let leaderboard;

  if(rankingAlgorithm === "elo") {
    leaderboard = rankByElo(props.usersdata)
    leaderboard = leaderboard.slice(0, props.numplayersonleaderboard);
  }
  if(rankingAlgorithm === "wins"){
    leaderboard = rankByTotalWins(props.usersdata)
    leaderboard = leaderboard.slice(0, props.numplayersonleaderboard);
  }
  if(rankingAlgorithm === "winpercent"){
    leaderboard = rankByWinPercent(props.usersdata)
    leaderboard = leaderboard.slice(0, props.numplayersonleaderboard);
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
        <Select
          defaultValue={{value: "elo", label: "rank by elo"}}
          options={[
            {value: "elo", label: "rank by elo"},
            {value: "wins", label: "rank by total wins"},
            { value: "winpercent", label: "rank by win %"}
          ]}
          theme={selectTheme}
          isSearchable={false}
          className="react-select-container"
          onChange={option =>{ setRankingAlgorithm(option.value)}}
        />
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
              <li className={styles.rank}>{i+1}</li>
              <li><h4 className={styles.name}>{user.info.firstname} {user.info.lastname}</h4></li>
              <li className={styles.stat}>{Math.round(user.elo*100)/100}</li>
              <li className={styles.stat}>{Math.round(user.winpercent*10000)/100}%</li>
              <li className={styles.stat}>{user.statistics.w}</li>
              <li className={styles.stat}>{user.statistics.l}</li>
            </ul>
          </li>
          );
        })}
      </ol>
    </section>
  </>);
}