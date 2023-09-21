import { withSessionSsr  } from "helpers/lib/config/withSession";
import { useRef, useState } from "react";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(user && user.permissions === 1){
      let data = await fetch(process.env.URL + "/api/users/getdata", req);
      data = await data.json();
      return { props: {user: user, usersdata: data} }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        }
      }
    }

  }
)


export default function Admin(props){
  let [usersdata, setUsersdata] = useState(props.usersdata);

  async function refreshUsersData(){
    let data = await fetch("/api/users/getdata");
    data = await data.json();
    setUsersdata(data);
  }


  const userSelect = useRef();
  const [selectedUser, setSelectedUser] = useState(props.usersdata[0]);
  
  function handleUserSelectChange (e) {
    setSelectedUser(usersdata.find((searchUser) => {
      return userSelect.current.value.toString() === searchUser.id.toString();
    }));
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
          permisions: permissionsInput.current.value,
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
        alert("created user sucessfully");
      } else {
        alert("failed to create user");
      }
    } else {
      alert("You must enter a username, password, and permissions level.");
    }

  }
  

  const passwordChangeInput = useRef();
  const firstnameChangeInput = useRef();
  const lastnameChangeInput = useRef();
  const permissionsChangeInput = useRef();
  const gradYearChangeInput = useRef();

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
        alert("User Deleted");
        await refreshUsersData();
        userSelect.current.value = usersdata[0].id;
        handleUserSelectChange();
      } else {
        alert("Something went wrong.");
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
        alert("Changes saved.");
      } else {
        alert("Something went wrong.");
      }
    } else {
      alert("Input cannot be blank.");
    }
  }

  async function handleChangeUserSubmit(e){
    e.preventDefault();

    let info = {
      firstname: firstnameChangeInput.current.value,
      lastname: lastnameChangeInput.current.value,
      gradyear: gradYearChangeInput.current.value
    };

    if(firstnameChangeInput.current.value === ""){
      firstnameChangeInput.current.value = selectedUser.info.firstname;
      info.firstname = selectedUser.info.firstname;
    }
    if(lastnameChangeInput.current.value === ""){
      lastnameChangeInput.current.value = selectedUser.info.lastname;
      info.lastname = selectedUser.info.lastname;
    }
    if(gradYearChangeInput.current.value === ""){
      gradYearChangeInput.current.value = selectedUser.info.gradyear;
      info.gradyear = selectedUser.info.gradyear;
    }
    if(permissionsChangeInput.current.value === ""){
      permissionsChangeInput.current.value = selectedUser.permissions;
    }

    const res = await fetch("/api/users/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: selectedUser.id,
        data: {
          permissions: permissionsChangeInput.current.value,
          info: info
        }
      })
    })

    if(res.status === 200){
      location.reload(true);
      await refreshUsersData();
      alert("Changes saved.");
    } else {
      alert("Something went wrong.");
    }
  }


  return (
    <>
      <h1>Admin Page!</h1>
      <div>logged in as <b>{props.user.username}</b></div>
      <div>
        <a href="/">home</a>
      </div>
      <div>
        <form onSubmit={handleCreateUserSubmit}>
          <h2>create user</h2>
          <div>
            <label htmlFor="username">username: </label>
            <input type="text" id="username" ref={usernameInput} />
          </div>
          <div>
            <label htmlFor="password">password: </label>
            <input type="text" id="password" ref={passwordInput} />
          </div>
          <div>
            <label htmlFor="permissions">permission level: (0 basic, 1 admin): </label>
            <input type="number" min="0" max="1" step="1" id="permissions" ref={permissionsInput} />
          </div>
          <div>
            <label htmlFor="firstname">firstname: </label>
            <input type="text"  id="firstname" ref={firstnameInput} />
            <label htmlFor="lastname"> lastname: </label>
            <input type="text"  id="lastname" ref={lastnameInput} />
          </div>
          <div>
            <label htmlFor="gradyear">gradyear: </label>
            <input type="number" min="2023" step="1" id="gradyear" ref={gradyearInput} />
          </div>
          <button type="submit">Create User</button>
        </form>
      </div>
      <div>
        <h2>edit user</h2>
        <div>
          <select id="userselect" onChange={handleUserSelectChange} ref={userSelect}>
            {usersdata.map((user) => {
              return (
              <option key={user.id} value={user.id}>
                {user.info.firstname} {user.info.lastname} ( {user.username} )
              </option>
              )})}
          </select>
          <button onClick={deleteUser}>Delete User</button>
        </div>
        <form onSubmit={handleChangePasswordSubmit}>
          <div>
            <label htmlFor="passwordChange">Set New Password: </label>
            <input type="text" id="passwordChange" ref={passwordChangeInput} />
            <button type="submit">Set Password</button>
          </div>
        </form>
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
            <label htmlFor="permissionsChange">Change Permissions (0 basic, 1 admin): </label>
            <input type="number" min="0" max="1" step="1" id="permissionsChange" placeholder={selectedUser.permissions} ref={permissionsChangeInput} />
          </div>
          <button type="submit">Update User Information</button>
        </form>
      </div>
    </>
  );
}