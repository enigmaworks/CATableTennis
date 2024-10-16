import { withSessionSsr  } from "/helpers/withIronSession";
import { useRef, useState } from "react";
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select'; 
import selectTheme from '/helpers/react-select-theme.js';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user && user.permissions === 2){
      let usersParams = new URLSearchParams({id:true, username:true, permissions: true, info_first_name:true, info_last_name: true, info_graduation: true, stats_w: true, stats_l: true});
      let data = await fetch(process.env.URL + "/api/users/getall?" + usersParams.toString(), req).then(response => {return response.json()});

      let sitedata = await fetch(process.env.URL + "/api/sitedata?" + new URLSearchParams({google_calendar_link:true, about_text:true, leaderboard_players:true, leaderboard_update_frequency: true}).toString(), req)
      sitedata = await sitedata.json();

      return { props: {signedin: true, user: user, reqsession: req.session, usersdata: data, usersparams: usersParams.toString(), sitedata: sitedata} }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        }
      }
    }

  }
);

export default function Admin(props){
  let [usersdata, setUsersdata] = useState(props.usersdata);

  const userSelect = useRef();
  const [selectedUser, setSelectedUser] = useState(props.usersdata[0]);

  const passwordChangeInput = useRef();
  const firstnameChangeInput = useRef();
  const lastnameChangeInput = useRef();
  const permissionsChangeInput = useRef();
  const gradYearChangeInput = useRef();
  const winsChangeInput = useRef();
  const lossesChangeInput = useRef();
  
  async function refreshUsersData(){
    await fetch("http://localhost:3000/api/users/getall?" + props.usersparams, {session: props.reqsession}).then(response => {
      return response.json()
    }).then(data => {
      setUsersdata(data);
      resetInputs();
    });
  }

  function resetInputs(){
    passwordChangeInput.current.value = "";
    firstnameChangeInput.current.value = "";
    lastnameChangeInput.current.value = "";
    permissionsChangeInput.current.value = "";
    gradYearChangeInput.current.value = "";
    winsChangeInput.current.value = "";
    lossesChangeInput.current.value = "";
  }

  function handleUserSelectChange (id) {
    setSelectedUser(usersdata.find((searchUser) => {
      return parseInt(id) === parseInt(searchUser.id);
    }));
    resetInputs();
  }

  const usernameInput = useRef();
  const passwordInput = useRef();
  const permissionsInput = useRef();
  const firstnameInput = useRef();
  const lastnameInput = useRef();
  const gradyearInput = useRef();

  async function handleCreateUserSubmit(e){
    e.preventDefault();

    if( usernameInput.current.value !== "" && passwordInput.current.value !== "" && permissionsInput.current.value !== "" ){
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: usernameInput.current.value,
          password: passwordInput.current.value,
          permissions: permissionsInput.current.value,
          info_first_name: firstnameInput.current.value,
          info_last_name: lastnameInput.current.value,
          info_graduation: gradyearInput.current.value,
        })
      })
  
      if(res.ok){
        usernameInput.current.value = "";
        passwordInput.current.value = "";
        permissionsInput.current.value = "";
        firstnameInput.current.value = "";
        lastnameInput.current.value = "";
        gradyearInput.current.value = "";
        await refreshUsersData();
        toast.success("created user sucessfully");
      } else {
        toast.error("failed to create user");
      }
    } else {
      toast.error("You must enter a username, password, and permissions level.");
    }

  }

  async function deleteUser(){
    if(confirm("Delete \"" + selectedUser.username + "\"?")){
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: parseInt(selectedUser.id)
        })
      })
      if(res.status === 200){
        passwordChangeInput.current.value = "";
        await refreshUsersData();
        toast.success("User Deleted");
        userSelect.value = usersdata[0].id;
        handleUserSelectChange(usersdata[0].id);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  async function handleChangePasswordSubmit(e){
    e.preventDefault();
    if(passwordChangeInput.current.value !== ""){
      const res = await fetch("/api/users/edit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: selectedUser.id,
          data: {password: passwordChangeInput.current.value}
        })
      })

      if(res.status === 200){
        passwordChangeInput.current.value = "";
        toast.success("Changes saved.");
      } else {
        toast.error("Something went wrong.");
      }
    } else {
      toast.error("Input cannot be blank.");
    }
  }

  async function handleChangeUserSubmit(e){
    e.preventDefault();

    let data = {}

    if(firstnameChangeInput.current.value !== "") data.info_first_name = firstnameChangeInput.current.value.toString();
    if(lastnameChangeInput.current.value !== "") data.info_last_name = lastnameChangeInput.current.value.toString();
    if(gradYearChangeInput.current.value !== "") data.info_graduation = gradYearChangeInput.current.value.toString();
    if(winsChangeInput.current.value !== "" && parseInt(winsChangeInput.current.value) !== selectedUser.stats_w) data.stats_w = parseInt(winsChangeInput.current.value);
    if(lossesChangeInput.current.value !== "" && parseInt(lossesChangeInput.current.value) !== selectedUser.stats_l) data.stats_l = parseInt(lossesChangeInput.current.value);
    if(permissionsChangeInput.current.value !== "" && parseInt(permissionsChangeInput.current.value) !== selectedUser.permissions) data.permissions = parseInt(permissionsChangeInput.current.value);
    
    const res = await fetch("/api/users/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: selectedUser.id,
        data: data
      })
    })

    if(res.status === 200){
      await refreshUsersData();
      resetInputs();
      toast.success("Changes saved.");
    } else {
      toast.error("Something went wrong.");
    }
  }

  const calendarLinkInput = useRef();
  const numLeaderboardPlayersInput = useRef();
  const aboutTextInput = useRef();
  const leaderboardUpdateFrequencyInput = useRef();

  async function handleUpdateSiteInfo(e){
    e.preventDefault();
    if(calendarLinkInput.current.value === "" && numLeaderboardPlayersInput.current.value === "" && aboutTextInput.current.value === ""){
      toast.error("Please enter a value.");
    } else {
      let data = {};

      if(calendarLinkInput.current.value !== ""){
        data.calendarlink = calendarLinkInput.current.value;
      }
      if(numLeaderboardPlayersInput.current.value !== ""){
        data.numplayersonleaderboard = parseInt(numLeaderboardPlayersInput.current.value);
      }
      if(aboutTextInput.current.value !== ""){
        data.about = aboutTextInput.current.value;
      }
      if(leaderboardUpdateFrequencyInput.current.value !== ""){
        data.leaderboard_update_frequency = parseInt(leaderboardUpdateFrequencyInput.current.value);
      }

      const res = await fetch("/api/sitedata", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...data})
      })

      if(res.status === 200){
        toast.success("Changes saved.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return (
    <>
    <Toaster position="bottom-center" reverseOrder={false}/>
    <Head>
      <title>Admin | Caravel Table Tennis</title>
    </Head>
    <header>
      <h1>Admin Panel</h1>
    </header>
    <section>
      <h2>Create New User Account</h2>
      <form onSubmit={handleCreateUserSubmit}>
        <div>
          <label htmlFor="username">username: </label>
          <input type="text" id="username" ref={usernameInput} />
        </div>
        <div>
          <label htmlFor="password">password: </label>
          <input type="text" id="password" ref={passwordInput} />
        </div>
        <div>
          <label htmlFor="permissions">permissions: </label>
          <input type="number" min="0" max="2" step="1" id="permissions" ref={permissionsInput} />
        </div>
        <div>
          <label htmlFor="firstname">firstname: </label>
          <input type="text"  id="firstname" ref={firstnameInput} />
        </div>
        <div>
          <label htmlFor="lastname"> lastname: </label>
          <input type="text"  id="lastname" ref={lastnameInput} />
        </div>
        <div>
          <label htmlFor="gradyear">gradyear: </label>
          <input type="number" min="2023" step="1" id="gradyear" ref={gradyearInput} />
        </div>
        <input type="submit" value="Create User"/>
      </form>
    </section>
    
    <section>
      <h2>Edit Existing User</h2>

      <div>
        <Select
          defaultValue={ { value: selectedUser.id, label: `${selectedUser.username} | ${selectedUser.info_first_name} ${selectedUser.info_last_name}`}}
          onChange={option => {handleUserSelectChange(option.value.toString())}}
          theme={selectTheme}
          className="react-select-container"
          options={usersdata.map((user) => {
            return ({
              value: user.id,
              label: `${user.username} | ${user.info_first_name} ${user.info_last_name}`,
            })
          })}
        />
      </div>

      <div>
        <h3>Set New Password</h3>

        <form onSubmit={handleChangePasswordSubmit}>
          <div>
            <label htmlFor="passwordChange">New password: </label>
            <input type="text" id="passwordChange" ref={passwordChangeInput} />
          </div>

          <input type="submit" value="Set Password"/>
        </form>

      </div>

      <div> 
        <h3>Update Account Details</h3>

        <form onSubmit={handleChangeUserSubmit}>
          <div>
            <label htmlFor="firstnameChange">First Name: </label>
            <input type="text" id="firstnameChange" placeholder={selectedUser.info_first_name} ref={firstnameChangeInput} />
          </div>

          <div>
            <label htmlFor="lastnameChange">Last Name: </label>
            <input type="text" id="lastnameChange" placeholder={selectedUser.info_last_name} ref={lastnameChangeInput} />
          </div>

          <div>
            <label htmlFor="gradyearChange">Graduation Year: </label>
            <input type="number" min={new Date().getFullYear()} step="1" id="gradyearChange" placeholder={new Date(selectedUser.info_graduation).getFullYear()} ref={gradYearChangeInput} />
          </div>

          <div>
            <label htmlFor="permissionsChange">Permissions: </label>
            <input type="number" min="0" max="1" step="1" id="permissionsChange" placeholder={selectedUser.permissions} ref={permissionsChangeInput} />
          </div>

          <div>
            <label htmlFor="winsChange">Wins: </label>
            <input type="number" id="winsChange" placeholder={selectedUser.stats_w} min="0" max="9999" step="1" ref={winsChangeInput}/>
          </div>
          <div>
            <label htmlFor="lossesChange">Losses: </label>
            <input type="number" id="lossesChange" placeholder={selectedUser.stats_l} min="0" max="9999" step="1" ref={lossesChangeInput}/>
          </div>

          <input type="submit" value="Update User Information"/>
          <button onClick={deleteUser}>Delete User</button>
        </form>
      </div>

    </section>

    <section>
      <h2>Update Site Information</h2>
      <form onSubmit={handleUpdateSiteInfo}>
        <div>
          <label htmlFor="calendarlink">Google Calendar Embed Link</label>
          <input type="text" id="calendarlink" defaultValue={props.sitedata.google_calendar_link} ref={calendarLinkInput} />
        </div>

        <div>
          <label htmlFor="leaderboardplayers">Players on Leaderboard</label>
          <input type="number" id="leaderboardplayers" defaultValue={props.sitedata.leaderboard_players} ref={numLeaderboardPlayersInput}/>
        </div>

        <div>
          <label htmlFor="aboutsite">About Paragraph</label>
          <textarea id="aboutsite" defaultValue={props.sitedata.about_text} ref={aboutTextInput}/>
        </div>

        <div>
          <label htmlFor="leaderboardUpdateFrequencyInput">Leaderboard Update Frequency (days)</label>
          <input type="number" min="0" max="28" step="1" id="leaderboardUpdateFrequencyInput" defaultValue={props.sitedata.leaderboard_update_frequency} ref={leaderboardUpdateFrequencyInput}/>
        </div>

        <input type="submit" value="Update Information"/>
      </form>
    </section>
    </>
  );
}