import { withSessionSsr  } from "helpers/lib/config/withSession";
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
    Match Page
  </>);
}