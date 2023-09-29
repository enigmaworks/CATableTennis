import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/index.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    let data = await fetch(process.env.URL + "/api/users/getdata", req);
    data = await data.json();
    const site = await fetch(process.env.URL + "/api/sitedata", {method:"GET"});
    const {numplayersonleaderboard} = await site.json();

    data = data.map(user => {
      let percent;
      if(user.statistics.w + user.statistics.l === 0){
        percent = 0;
      } else{
        percent = user.statistics.w / (user.statistics.w + user.statistics.l);
      }
      return {
        id: user.id,
        name: user.info.firstname + " " + user.info.lastname,
        w: user.statistics.w,
        l: user.statistics.l,
        percent: percent,
      }
    });

    data = data.sort((a, b)=>{
      if(a.percent > b.percent){
        return -1;
      } else if (b.percent > a.percent){
        return 1;
      } else {
        return 0;
      }
    });

    data = data.slice(0, numplayersonleaderboard);

    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user, usersdata: data }}
    } else {
      return {props: { signedin: false, user: null, usersdata: data }}
    }
  }
);

export default function Home(props){
  return (<>
  <Head>
    <title>Caravel Table Tennis</title>
  </Head>
  <header>
    <h1>Caravel Academy Table Tennis Club</h1>
  </header>
  <section>
    <h2>Leaderboard</h2>
    <ol className={styles.leaderboard}>
      <li className={styles.headerrow}>
        <ul>
          <li className={styles.rank}><h3>Rank</h3></li>
          <li><h3>Player</h3></li>
          <li className={styles.stat}><h3>Win %</h3></li>
          <li className={styles.stat}><h3>Wins</h3></li>
          <li className={styles.stat}><h3>Losses</h3></li>
        </ul>
      </li>
      {props.usersdata.map((user, i) => {
        return (
        <li className={styles.player} key={user.id}>
          <ul className={styles.playerstats}>
            <li className={styles.rank}>{i+1}</li>
            <li><h4 className={styles.name}>{user.name}</h4></li>
            <li className={styles.stat}>{Math.round(user.percent*10000)/100}%</li>
            <li className={styles.stat}>{user.w}</li>
            <li className={styles.stat}>{user.l}</li>
          </ul>
        </li>
        );
      })}
    </ol>
  </section>
  </>);
}