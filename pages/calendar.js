import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "/styles/calendar.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    const data = await fetch(process.env.URL + "/api/sitedata", {method:"GET"});
    const {calendarlink} = await data.json();

    if(user){
      return {props: { signedin: true, user: user, calendarlink: calendarlink }}
    } else {
      return {props: { signedin: false, user: null, calendarlink: calendarlink }}
    }
  }
);

export default function calendar(props){
  return (<>
    <Head>
      <title>Calendar | Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>Calendar</h1>
    </header>
    <div className={styles.calendarframe}>
      <iframe src={props.calendarlink} frameborder="0"></iframe>
    </div>
  </>);
}