import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "/styles/calendar.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user){
      return {props: { signedin: true, user: user }}
    } else {
      return {props: { signedin: false, user: null }}
    }
  }
);

export default function calendar(){
  // will be replaceable by an admin
  const calendarLink = "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&showTitle=0&showTz=0&showCalendars=0&showPrint=0&showTabs=0&showDate=0&showNav=0&src=Y182YTQxZjA4ZThhODQ3OGU5ODc0N2Q0NThlYjRiNWI3MTM5NjE1MjFlYTg4ZWIzNjVmZTU4MjAzNDljZDkzYTdkQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23AD1457";

  return (<>
    <Head>
      <title>Calendar | Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>Calendar</h1>
    </header>
    <iframe className={styles.calendarframe} src={calendarLink} frameborder="0"></iframe>
  </>);
}