import { withSessionSsr  } from "lib/config/withSession";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    if(!user){
      return {
        props: { signedin: false }
      }
    }

    return { props: { signedin: true, user: user } }
  }
)

export default function Login(props){
  const router = useRouter();
  const usernameInput = useRef();
  const passwordIndput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameInput.current.value;
    const password = passwordIndput.current.value;

    if(username !== "" && password !== "") {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
      });

      if(res.status === 200){
        return router.push("/");
      } else {
        alert("Incorrect username or password.");
      }
    } else {
      alert("You must enter both a username and password.");
    }
  }
  
  if(!props.signedin){
    return (
      <>
        <h1>Login page</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">username: </label>
          <input type="text" id="username" ref={usernameInput} />
          <label htmlFor="password">password: </label>
          <input type="password" id="password" ref={passwordIndput} />
          <button type="submit">Sign In</button>
        </form>
        <div>
          <a href="/">home</a>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1>Login page</h1>
        <div>Already signed in as {props.user.username}</div>
        <div><a href="/">Home</a></div>
      </>
    );
  }
}