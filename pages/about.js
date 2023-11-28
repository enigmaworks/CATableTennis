import { withSessionSsr  } from "helpers/withSession";
import styles from "/styles/about.module.css";
import Head from 'next/head';

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
      <h1>About The Club</h1>
    </header>
    <section>
      <div>{props.abouttext}</div>
    </section>
    <section>
      <h2>Calendar</h2>
      <div className={styles.calendarframe}>
        <iframe src={props.calendarlink} frameborder="0"></iframe>
      </div>
    </section>
    <section>
      <h2></h2>
    </section>
  </>);
}