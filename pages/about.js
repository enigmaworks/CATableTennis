import { withSessionSsr  } from "helpers/withIronSession";
import styles from "/styles/about.module.css";
import Head from 'next/head';
import Link from "next/link";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    const data = await fetch(process.env.URL + "/api/sitedata", {method:"GET"});
    const {calendarlink, about} = await data.json();

    if(user){
      return {props: { signedin: true, user: user, calendarlink: calendarlink, abouttext:about }}
    } else {
      return {props: { signedin: false, user: null, calendarlink: calendarlink, abouttext:about }}
    }
  }
);

export default function calendar(props){
  return (<>
    <Head>
      <title>About | Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>Caravel Academy Table Tennis Club</h1>
    </header>
    <section>
      <h2>About The Club</h2>
      <div>{props.abouttext}</div>
    </section>
    <section>
      <h2>Calendar</h2>
      <div className={styles.calendarframe}>
        <iframe src={props.calendarlink} frameborder="0"></iframe>
      </div>
    </section>
    <section>
      <h2>FAQ</h2>

      <h3>How can I join?</h3>
      <p>Ask the supervisor or a member of the club, or visit the  Caravel Club and Activites Website for more information.</p>
      
      <h3>Why am I not on the leaderboard?</h3>
      <p>
        The leaderboard only ranks players with a graduation year in the system less than the current year.
        If there is a mistake in your record or graduation year, ask an admin to correct the error.
        Otherwise, play games to improve your record and work your way up the leaderboard.
        Elo is calculated by weighing the win percentage of each user against the average win percentage of all rankable players.
      </p>

      <h3>How do I create an account?</h3>
      <p>Ask the club supervisor or another admin to create you an account.</p>

      <h3>How do delete my account? <br></br> How do change my password / other account information?</h3>
      <p>Only site admins have the ability create accounts, change account information (such as name and graduation year), change passwords, and delete accounts.</p>
      
      <h3>Other Technical Questions and Support</h3>
      <p>
        This site was created by class of '25 Caravel student Eddie Radecki. All of the source code is available publicly on Github at <Link href="https://www.github.com/enigmaworks/CATableTennis">this repo</Link>, though changes may not be reflected in this live site unless a recent build has been made.
        Any specific technical questions can be directed to Eddie through his caravel.org email, and more general issues can be directed towards a STEM Club organizer or the helpdesk. Contributions to the source code are welcome.
      </p>
    </section>
  </>);
}