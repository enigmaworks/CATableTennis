import { withSessionSsr  } from "/helpers/withIronSession";
import styles from "/styles/about.module.css";
import Head from 'next/head';
import Link from "next/link";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    let usersParams = new URLSearchParams({google_calendar_link: true, about_text: true}).toString();
    let data = await fetch(process.env.URL + "/api/sitedata?" + usersParams, Object.assign(req, {next: {revalidate: 900}})).then(response => {return response.json()});

    if(req.session && req.session.user){
      return {props: {
        signedin: true,
        user: req.session.user,
        calendarlink: data.google_calendar_link,
        abouttext:data.about_text
      }}
    } else {
      return {props: {
        signedin: false,
        user: null,
        calendarlink: data.google_calendar_link,
        abouttext:data.about_text
      }}
    }
  }
);

export default function calendar(props){
  return (<>
    <Head>
      <title>About | Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>About CATT</h1>
    </header>
    <section>
      <div>{props.abouttext}</div>
    </section>
    <section>
      <h2>Calendar</h2>
      <div className={styles.calendarframe}>
        <iframe src={props.calendarlink} ></iframe>
      </div>
    </section>
    <section>
      <h2>Club Origins</h2>

      <p>
        Sajjan Subramanian, class of 2026, was inspired to form the club during the 2023-2024 school year.
        Acheiving board approval more six months later, the club  officially had it's first meeting in October of 2024.
      </p>
    </section>
    <section>
      <h2>Website</h2>
      <p>
        This website was built by class of Eddie Radecki, class of 2025. Source code is available on Github in <Link href="https://www.github.com/enigmaworks/CATableTennis">this repository</Link>. If something is broken, feel free to reach out to eddie.radecki@gmail.com.
      </p>

      <h3>Leaderboard & Rankings</h3>
      <p>Rankings only include current players, but you can see the final record of graduated players on the <Link href="/players">players page</Link>.</p>
      <p>The elo system is inspired by chess rankings, and weighs a player's win percent against the average win percent of all players.</p>

      <h3>Accounts & Joining the Club</h3>
      <p>Only site admins have the ability create accounts, change account information (name, graduation year, and passwords), and delete accounts. If you wish to update any information or delete your account, reach out to the club supervisor or someone with permissions.</p>
      
      <h3>Matches</h3>
      <p>To access the scoreboard and match result page, a user account must have Club Leader or Admin permission level. </p>
      <p> If a match result was saved incorrectly, admins have the ability to update records.</p>
    </section>
  </>);
}