import { withSessionSsr  } from "helpers/lib/config/withSession";
import { useRef, useState } from "react";
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user && user.permissions === 1){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      return { props: {signedin: true, user: user, usersdata: data} }
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

  async function refreshUsersData(){
    let data = await fetch("/api/users/getdata");
    data = await data.json();
    setUsersdata(data);
    location.reload();
  }


  const userSelect = useRef();
  const [selectedUser, setSelectedUser] = useState(props.usersdata[0]);

  const passwordChangeInput = useRef();
  const firstnameChangeInput = useRef();
  const lastnameChangeInput = useRef();
  const permissionsChangeInput = useRef();
  const gradYearChangeInput = useRef();
  const winsChangeInput = useRef();
  const lossesChangeInput = useRef();
  
  function resetInputs(){
    passwordChangeInput.current.value = "";
    firstnameChangeInput.current.value = "";
    lastnameChangeInput.current.value = "";
    permissionsChangeInput.current.value = "";
    gradYearChangeInput.current.value = "";
    winsChangeInput.current.value = "";
    lossesChangeInput.current.value = "";
  }

  function handleUserSelectChange (e) {
    setSelectedUser(usersdata.find((searchUser) => {
      return userSelect.current.value.toString() === searchUser.id.toString();
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
          userinfo: {
            firstname: firstnameInput.current.value,
            lastname: lastnameInput.current.value,
            gradyear: gradyearInput.current.value
          }
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
        toast.success("User Deleted");
        await refreshUsersData();
        userSelect.current.value = usersdata[0].id;
        handleUserSelectChange();
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
          data: {
            password: passwordChangeInput.current.value
          }
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

    let info = {
      firstname: firstnameChangeInput.current.value || selectedUser.info.firstname,
      lastname: lastnameChangeInput.current.value || selectedUser.info.lastname,
      gradyear: gradYearChangeInput.current.value || selectedUser.info.gradyear
    };

    let statistics = {
      w: parseInt(winsChangeInput.current.value || selectedUser.statistics.w),
      l: parseInt(lossesChangeInput.current.value || selectedUser.statistics.l),
    };

    const res = await fetch("/api/users/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: selectedUser.id,
        data: {
          permissions: permissionsChangeInput.current.value,
          info: info,
          statistics: statistics
        }
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
        data.numplayersonleaderboard = numLeaderboardPlayersInput.current.value;
      }
      if(aboutTextInput.current.value !== ""){
        data.about = aboutTextInput.current.value;
      }

      const res = await fetch("/api/sitedata", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...data})
      })

      if(res.status === 200){
        calendarLinkInput.current.value = "";
        numLeaderboardPlayersInput.current.value = "";
        aboutTextInput.current.value = "";
        toast.success("Changes saved.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  return (
    <>
    <Toaster
        position="bottom-center"
        reverseOrder={false}
    />
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
          <input type="number" min="0" max="1" step="1" id="permissions" ref={permissionsInput} />
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
        <button type="submit">Create User</button>
      </form>
    </section>
    
    <section>
      <h2>Edit Existing User</h2>

      <div>
        <select id="userselect" onChange={handleUserSelectChange} ref={userSelect}>
          {usersdata.map((user) => {
            return (
            <option key={user.id} value={user.id}>
              {user.info.firstname} {user.info.lastname} ( {user.username} )
            </option>)
          })}
        </select>
      </div>

      <div>
        <h3>Set New Password</h3>

        <form onSubmit={handleChangePasswordSubmit}>
          <div>
            <label htmlFor="passwordChange">New password: </label>
            <input type="text" id="passwordChange" ref={passwordChangeInput} />
          </div>

          <button type="submit">Set Password</button>
        </form>

      </div>

      <div> 
        <h3>Update Account Details</h3>

        <form onSubmit={handleChangeUserSubmit}>
          <div>
            <label htmlFor="firstnameChange">First Name: </label>
            <input type="text" id="firstnameChange" placeholder={selectedUser.info.firstname} ref={firstnameChangeInput} />
          </div>

          <div>
            <label htmlFor="lastnameChange">Last Name: </label>
            <input type="text" id="lastnameChange" placeholder={selectedUser.info.lastname} ref={lastnameChangeInput} />
          </div>

          <div>
            <label htmlFor="gradyearChange">Graduation Year: </label>
            <input type="number" min="2023" step="1" id="gradyearChange" placeholder={selectedUser.info.gradyear} ref={gradYearChangeInput} />
          </div>

          <div>
            <label htmlFor="permissionsChange">Permissions: </label>
            <input type="number" min="0" max="1" step="1" id="permissionsChange" placeholder={selectedUser.permissions} ref={permissionsChangeInput} />
          </div>

          <div>
            <label htmlFor="winsChange">Wins: </label>
            <input type="number" id="winsChange" placeholder={selectedUser.statistics.w} min="0" max="9999" step="1" ref={winsChangeInput}/>
          </div>
          <div>
            <label htmlFor="lossesChange">Losses: </label>
            <input type="number" id="lossesChange" placeholder={selectedUser.statistics.l} min="0" max="9999" step="1" ref={lossesChangeInput}/>
          </div>

          <button type="submit">Update User Information</button>
          <button onClick={deleteUser}>Delete User</button>
        </form>
      </div>

      <div>
        <h2>Update Site Information</h2>
        <form onSubmit={handleUpdateSiteInfo}>
          <div>
            <label htmlFor="calendarlink">Google Calendar Embed Link</label>
            <input type="text" id="calendarlink" ref={calendarLinkInput} />
          </div>

          <div>
            <label htmlFor="leaderboardplayers">Players on Leaderboard</label>
            <input type="number" id="leaderboardplayers" ref={numLeaderboardPlayersInput}/>
          </div>

          <div>
            <label htmlFor="aboutsite">About Paragraph</label>
            <textarea id="aboutsite" ref={aboutTextInput}/>
          </div>

          <button type="submit">Update Information </button>
        </form>
      </div>
    </section>
    </>
  );
}