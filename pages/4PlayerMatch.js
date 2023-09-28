import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/match.module.css";
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

export default function Match(){
  return (
  <>
    <Head>
      <title>Match | Caravel Table Tennis </title>
    </Head>
    <h2 className={styles.p1}>Billy</h2>
    <h2 className={styles.p2}>Joe</h2>    {/*Obviously all of these will be switched to variables*/}
    <h2 className={styles.p3}>Bob</h2>
    <h2 className={styles.p4}>Will</h2>
  </>);
}