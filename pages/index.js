import { withSessionSsr  } from "helpers/lib/config/withSession";
import Head from 'next/head';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    let data = await fetch(process.env.URL + "/api/users/getdata", req);
    data = await data.json();
    data = data.map(user => {
      return {
        name: user.info.firstname + " " + user.info.lastname,
        w: user.statistics.w,
        l: user.statistics.l,
        percent: user.statistics.w / (user.statistics.w + user.statistics.l),
      }
    });
    data = data.sort((a, b)=>{
      if(a.percent > b.percent){
        return -1;
      } else if (b.percent > a.percent){
        return 1;
      } else {
        return 0;
      }
    });
    if(user){
      return {props: { signedin: true, user: user, usersdata: data }}
    } else {
      return {props: { signedin: false, user: null, usersdata: data }}
    }
  }
);

export default function Home(props){
  return (<>
  <Head>
    <title>Caravel Table Tennis</title>
  </Head>
  <header>
    <h1>Caravel Academy Table Tennis Club</h1>
  </header>
  <div>
    {props.usersdata.map(user => {
      return (
      <ul>
        <li><h3>{user.name}</h3></li>
        <li>Win Percent: {user.percent}%</li>
        <li>Wins: {user.w}</li>
        <li>Losses: {user.l}</li>
      </ul>
      );
    })}
  </div>
  </>);
}