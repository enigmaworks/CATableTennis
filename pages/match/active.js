import { useRouter } from "next/router";
import { withSessionSsr  } from "helpers/lib/config/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    if(user && user.permissions === 1){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      return {props: { signedin: true, user: user, usersdata: data}}
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        }
      }
    }
  }
);


export default function MatchPage(props){
  const {query} = useRouter();

  let team1 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p1b))];
  let team2 = [props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2)), props.usersdata.find(user => parseInt(user.id) === parseInt(query.p2b))];

  return(
    <div>
      <div>
        <div>{team1[0].info.firstname} {team1[0].info.lastname}</div>
        {parseInt(query.players) == 4 ? <>
          <div>{team1[1].info.firstname} {team1[1].info.lastname}</div>
        </> : "" }
      </div>
      <div>
        <div>{team2[0].info.firstname} {team2[0].info.lastname}</div>
        {parseInt(query.players) == 4 ? <>
          <div>{team2[1].info.firstname} {team2[1].info.lastname}</div>
        </> : "" }
      </div>
    </div>
  );
}