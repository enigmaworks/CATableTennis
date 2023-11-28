import { withSessionSsr  } from "helpers/withSession";
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

export default function Players(){
  return (<>
  <Head>
    <title>Players | Caravel Table Tennis</title>
  </Head>
  Players Page
  </>);
}