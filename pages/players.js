import { withSessionSsr  } from "helpers/withIronSession";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    let data = await fetch(process.env.URL + "/api/users/getdata", req);
    data = await data.json();

    if(user){
      return {props: { signedin: true, user: user, usersdata: data }}
    } else {
      return {props: { signedin: false, user: null, usersdata: data }}
    }
  }
);

export default function Players(props){
  return (<>
  <Head>
    <title>Players | Caravel Table Tennis</title>
  </Head>
  <section>
    <h2>Current Players</h2>
    <h2>Graduated Players</h2>
  </section>
  </>);
}