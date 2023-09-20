import { withSessionSsr  } from "lib/config/withSession";
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
  const usernameInput = useRef();
  const passwordInput = useRef();
  const permissionsInput = useRef();
  const firstnameInput = useRef();
  const lastnameInput = useRef();
  const gradyearInput = useRef();

  async function handleCreateUserSubmit(e){
    e.preventDefault();

    if( usernameInput.current.value !== "" && passwordInput.current.value !== "" && permissionsInput.current.value !== "" ){
      const res = await fetch("/api/createuser", {
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
        alert("created user sucessfully");
      } else {
        alert("failed to create user");
      }
    } else {
      alert("You must enter a username, password, and permissions level.");
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
            <input type="number" min="1900" max="2200" step="1" id="gradyear" ref={gradyearInput} />
          </div>
          <button type="submit">Create User</button>
        </form>
      </div>
      <div>
        <h3>edit user</h3>
        <ul>{props.usersdata.map(user => <li>{user.username}</li>)}</ul>
      </div>
    </>
  );
}