import { withSessionSsr  } from "/helpers/withIronSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user){
      let params = new URLSearchParams({
        id: user.id,
        flair: true,
        info_graduation: true,
        stats_w: true,
        stats_l: true,
        stats_rank: true,
        stats_elo: true,
        date_stats_updated:true,
        date_created: true}
      ).toString();
      
      let data = await fetch(process.env.URL + "/api/users/getuser?" + params, req).then(response => {return response.json()});

      return { props: {signedin: true, user: {...user, ...data} }};
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
  return(
  <>
    <header>
      <h1>My Profile</h1>
    </header>
    <section>
      <h2>{props.user.info_first_name} {props.user.info_last_name}</h2>
      <div>
        {props.user.permissions === 0 ? "Player" : props.user.permissions === 1 ? "Club Leader" : "Admin"}
      </div>
      <div>Joined {new Date(props.user.date_created).toLocaleDateString()}</div>
      <h3>
        Rank: #{props.user.stats_rank}
      </h3>
      <div>As of {new Date(props.user.date_stats_updated).toLocaleDateString()}</div>
      <h3>Career Record</h3>
      <div>Wins: {props.user.stats_w}</div>
      <div>Loses: {props.user.stats_l}</div>
      <div></div>
    </section>
  </>)
}