import { withSessionSsr  } from "helpers/withIronSession";
import { calculateEloAndWinPercents, rankByElo, rankByTotalWins, rankByWinPercent } from "/helpers/rankingFunctions";
import { useEffect, useState } from "react";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      data = calculateEloAndWinPercents(data);

      return { props: {signedin: true, user: user, usersdata: data} }
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

export default function ProfilePage(props){
  const [rankingAlgorithm, setRankingAlgorithm] = useState("elo");
  let leaderboard;
  let rank;

  useEffect(()=>{
    if(rankingAlgorithm === "elo") {
      leaderboard = rankByElo(props.usersdata)
    } else if(rankingAlgorithm === "wins"){
      leaderboard = rankByTotalWins(props.usersdata)
    } else if(rankingAlgorithm === "winpercent"){
      leaderboard = rankByWinPercent(props.usersdata)
    }
    rank = 1 + leaderboard.findIndex(user=>user.id === props.user.id);
  }, [rankingAlgorithm]);

  return(
  <>
    <header>
      <h1>My Profile</h1>
    </header>
    <section>
      <h2>{props.user.firstname} {props.user.lastname}</h2>
      <div>
        {props.user.permissions === 0 ? "Player" : props.user.permissions === 1 ? "Admin" : "Super Admin"}
      </div>
      <h3>
        Rank: #{"000"}
      </h3>
      <div>{'(as of ' + "mm/dd/yyyy" + ')'}</div>
      <h3>Career Record</h3>
      <div>Wins: {}</div>
      <div>Loses: {}</div>
      <div>Last Game: {"mm/dd/yyyy"}</div>
      <div></div>
    </section>
  </>)
}