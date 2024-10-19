import { useRef } from "react";
import { withSessionSsr  } from "/helpers/withIronSession";
import toast, { Toaster } from 'react-hot-toast';

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

      return { props: {signedin: true, user: {...user, ...data}, session: req.session}};
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
  let oldPasswordInput = useRef();
  let newPasswordInput = useRef();

  async function handleChangePasswordSubmit(e){
    e.preventDefault();
    if(oldPasswordInput.current.value !== "" && newPasswordInput.current.value !== "" ){
      await fetch('/api/users/edit', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        session: props.session,
        body: JSON.stringify({
          id: props.user.id,
          old_password: oldPasswordInput.current.value,
          new_password: newPasswordInput.current.value,
        })
      }).then(res => {
        if(res.ok){
          toast.success("Changed Password Sucessfully");
          oldPasswordInput.current.value = "";
          newPasswordInput.current.value = "";
        } else if(res.status === "401") {
          toast.error("Incorrect Password");
        } else {
          toast.error("Something went wrong!");
        }
      })
    }
  }

  return(
  <>
    <Toaster position="bottom-center" reverseOrder={false}/>
    <header>
      <h1>My Profile</h1>
    </header>
    <section>
      <h2>{props.user.info_first_name} {props.user.info_last_name}</h2>
      <div className="bold">
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
    </section>
    <section>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePasswordSubmit}>
        <div>
          <label htmlFor="password">Old Password: </label>
          <input type="password" id="password" ref={oldPasswordInput}/>
        </div>
        <div>
          <label htmlFor="password">New Password: </label>
          <input type="password" id="password" ref={newPasswordInput}/>
        </div>
        <input type="submit" value="Change Password" />
      </form>
    </section>
  </>)
}