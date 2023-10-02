import { withSessionSsr  } from "helpers/lib/config/withSession";
import styles from "styles/about.module.css";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    const data = await fetch(process.env.URL + "/api/sitedata", {method:"GET"});
    const {about} = await data.json();

    if(user){
      return {props: { signedin: true, user: user, abouttext: about }}
    } else {
      return {props: { signedin: false, user: null, abouttext: about }}
    }
  }
);

export default function about(props) {
  return (
    <>
      <Head>
        <title>About | Caravel Table Tennis</title>
      </Head>
      <header className={styles.heading}>
        <h1>About CATT</h1>
      </header>
      <section>
        <p>{props.abouttext}</p>
      </section>
    </>
  );
};
